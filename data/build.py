import json, random, re
from lex import fam
items=json.load(open(__import__('os').path.join(__import__('os').path.dirname(__file__),'items_base.json')))
for it in items:
    a=[]
    for x in it['ans']:
        if x.lower()=='(met een) fiets': x='Met de fiets'
        if x.lower()=='werken gewerkt': x='Werken'
        if x not in a: a.append(x)
    if it['q'] in ('Hoe bent u hier gekomen?','Hoe gaat u naar uw werk?'):
        a=['Met de fiets','Met de bus','Met de trein','Met de auto','Met de taxi']
    if re.search(r'\bnaar\s*\.+$',it['q']): a=[x[5:][0].upper()+x[5:][1:] if x.lower().startswith('naar ') else x for x in a]
    it['ans']=a
A=[i for i,it in enumerate(items) if it['part']=='A']
B=[i for i,it in enumerate(items) if it['part']=='B']
POOL={
 'F':['Brood','Rijst','Kaas','Soep','Appels','Bananen','Koffie','Melk','Vis','Thee','Aardappels','Eieren','Uien','Boter'],
 'A':['Een kat','Een hond','Paarden','Koeien','Olifanten','Kikkers','Vogels','Een muis'],
 'B':['Hoofd','Voet','Buik','Rug','Tanden','Neus','Oren','Handen'],
 'C':['Een jas','Schoenen','Een broek','Een trui','Sokken','Een rok','Een muts'],
 'T':['De fiets','De bus','De trein','De auto','De metro','De tram','Het vliegtuig'],
 'H':['Zwanger','Verkouden','Jarig','Verdrietig'],
 'W':['Gisteren','Vorig jaar','Gisteravond','Eergisteren','Vorige week'],
 'O':['Zwanger','Verkouden','Jarig','Langzaam','Verdrietig'],   # for 'over...' stems
 'J':['Dokter','Kapper','Leraar','Bakker','Politieagent','Schilder','Verpleegster'],
 'X':['Engels','Arabisch','Spaans','Duits'],
}
ALLOW={'E':set('FABCT'),'M':set('FABC'),'N':set('FABC'),'Q':set('FABC'),
 'B':set('FHX'),'F':set('HJX'),'V':set('HBF'),'L':set('HBF'),'P':set('HFX'),'T':set('HFX'),
 'S':set('HJ'),'J':set('HF'),'G':set('HFB'),'X':set('HFB'),'A':set('HXJ'),'C':set('HFX')}
OBJ=r'\b(wil|wilt|willen|zoekt|zoeken|koopt|eet|haalt|pakt|neemt|krijgt|krijg|kookt|maakt|drinkt|drinken|verkoopt|ziet|heeft|hebben|houdt|houd|speelt|kijkt|kijken|luistert|voor|er zijn veel|zit ook|zit|staat|lust|geeft|stuurt|vraagt|bakt|verkoopt)\b'
NOJ=r'\b(zoekt|ziet|wil|wilt|heeft|belt|kijkt|kijken|wacht|krijgt|zit|staat|geeft)\b'
BAN={'Paula heeft een brief':['Gisteren','Vorig jaar','Gisteravond','Eergisteren','Vorige week'],'Wil je mijn huis zien':['Vorig jaar'],
     'Wil je mijn huis zien':[], }
def ISV(c): return bool(re.search(r'(\b(is|ben|blijft|wordt|was)|^(ze|zij|we|wij) zijn)\s*(zo|daar|altijd|vaak|hij|ze)?\s*[.…]+\??$',c))
def clause(q):
    parts=re.split(r'(?<=[.!?])\s+',q.strip())
    return parts[-1].lower()
def base(w): return re.sub(r'^(de|het|een|met de|met|naar de|naar|in de|in|op de|op)\s+','',w.lower())
def allowedB(it):
    fams={fam(a) for a in it['ans']}
    s=None
    for f in fams: s=ALLOW[f] if s is None else s&ALLOW[f]
    s=set(s or 'H'); c=clause(it['q'])
    if re.search(r'\bover\s*\.+\??$',c): s={'O'}
    else:
        if re.search(OBJ,c): s-=set('FACT')
        if re.search(r'\b(houdt|houd|kijkt|kijken|leest|lees|zoekt)\b',c): s.discard('X')
        if re.search(NOJ,c): s.discard('J')
        if ISV(c): s.discard('H'); s|=set('FAC')
    s-=fams
    if len(s)<2 and 'O' not in s: s|= {'H'} if not ISV(c) else set('FAC')
    s-=fams
    if 'H' in s and not ISV(c): s.add('W')
    if ISV(c): s.discard('W')
    return s,fams
def bad(it,w):
    b=base(w); acc={base(a) for a in it['ans']}|{a.lower() for a in it['ans']}
    if b in acc or w.lower() in acc: return True
    if re.search(r'\b'+re.escape(b),it['q'].lower()): return True
    for k,v in BAN.items():
        if it['q'].startswith(k) and w in v: return True
    return False
def distB(it,rng,correct):
    s,_=allowedB(it); fl=sorted(s); rng.shuffle(fl); out=[]; t=0
    while len(out)<3 and t<500:
        f=fl[len(out)%len(fl)] if t<60 else rng.choice(fl); t+=1
        w=rng.choice(POOL[f])
        if w in out or w.lower()==correct.lower() or bad(it,w): continue
        out.append(w)
    assert len(out)==3,(it,s)
    return out
# ---- Part A
CONF=[set(x) for x in ['NQ','EM','LG','LP','VL','VF','VS','VX','PJ','JV','SX','XV']]
NOUSE={'dat weet ik niet','alles is goed','veel dingen','nederland is mooi'}
def famsA(it): return {fam(a) for a in it['ans']}
def compat(f1,fs2):
    for f2 in fs2:
        if f1==f2 or {f1,f2} in CONF: return False
    return True
def distA(it,rng,correct):
    fs=famsA(it); cands=[]
    for j in A:
        o=items[j]
        if o is it: continue
        for a in o['ans']:
            if a.lower() in NOUSE: continue
            if a.lower() in {x.lower() for x in it['ans']}: continue
            if compat(fam(a),fs): cands.append((fam(a),a))
    rng.shuffle(cands); out=[]; used=set()
    for f,a in cands:
        if f in used or a in out: continue
        out.append(a); used.add(f)
        if len(out)==3: break
    assert len(out)==3,it
    return out
def revA(it,rng,ansIdx):
    choices=[a for a in it['ans'] if a.lower() not in NOUSE]
    a=choices[ansIdx%len(choices)]; f=fam(a)
    cands=[items[j]['q'] for j in A if items[j] is not it and compat(f,famsA(items[j])) and a.lower() not in {x.lower() for x in items[j]['ans']}]
    rng.shuffle(cands)
    return a,cands[:3]
rng=random.Random(20261025)
NT,NB,NAF,NAR=40,22,5,3
def schedule(pool,per,rng):
    seq=[]
    while len(seq)<NT*per:
        p=pool[:]; rng.shuffle(p); seq+=p
    tests=[[] for _ in range(NT)]
    for i in seq[:NT*per]:
        # place into first test (in rotation order) that has room and doesn't have it
        pass
    return seq[:NT*per]
def assign(seq,per,taken):
    tests=[[] for _ in range(NT)]; ptr=0
    for i in seq:
        for k in range(NT):
            t=(ptr+k)%NT
            if len(tests[t])<per and i not in tests[t] and i not in taken[t]:
                tests[t].append(i); ptr=(t+1)%NT; break
        else: raise Exception('cannot place')
    return tests
taken=[set() for _ in range(NT)]
seqB=schedule(B,NB,rng); tB=assign(seqB,NB,taken)
seqAF=schedule(A,NAF,rng); tAF=assign(seqAF,NAF,taken)
for t in range(NT): taken[t]|=set(tAF[t])
AR=[i for i in A if any(a.lower() not in NOUSE for a in items[i]['ans'])]
seqAR=schedule(AR,NAR,rng); tAR=assign(seqAR,NAR,taken)
occ={}
tests=[]
def mkopts(correct,ds,rng):
    opts=[correct]+ds; rng.shuffle(opts); return opts,opts.index(correct)
for t in range(NT):
    qs=[]
    for i in tAF[t]:
        it=items[i]; k=occ.get(('f',i),0); occ[('f',i)]=k+1
        good=[a for a in it['ans'] if a.lower() not in NOUSE] or it['ans']
        c=good[(k+i)%len(good)]
        o,ix=mkopts(c,distA(it,rng,c),rng)
        qs.append({'t':'A','q':it['q'],'o':o,'c':ix,'acc':it['ans'],'src':i})
    for i in tAR[t]:
        it=items[i]; k=occ.get(('r',i),0); occ[('r',i)]=k+1
        a,ds=revA(it,rng,k+i+1)
        o,ix=mkopts(it['q'],ds,rng)
        qs.append({'t':'R','q':a,'o':o,'c':ix,'acc':[it['q']],'src':i})
    bq=[]
    for i in tB[t]:
        it=items[i]; k=occ.get(('b',i),0); occ[('b',i)]=k+1
        c=it['ans'][(k+i)%len(it['ans'])]
        o,ix=mkopts(c,distB(it,rng,c),rng)
        bq.append({'t':'B','q':it['q'],'o':o,'c':ix,'acc':it['ans'],'src':i})
    # order: A forward, reverse, then B (exam order), shuffle within groups
    rng.shuffle(qs); 
    tests.append(qs+bq)
# ---- validate
from collections import Counter
assert len(tests)==40
srcuse=Counter()
for ti,qs in enumerate(tests):
    assert len(qs)==30,(ti,len(qs))
    keys=[(q['src']) for q in qs]; assert len(set(keys))==30,(ti,'dup item')
    for q in qs:
        assert len(q['o'])==4 and len({x.lower() for x in q['o']})==4,q
        assert 0<=q['c']<4
        accl={x.lower() for x in q['acc']}
        assert q['o'][q['c']].lower() in accl or q['o'][q['c']]==q['acc'][0]
        for j,x in enumerate(q['o']):
            if j!=q['c']:
                assert x.lower() not in accl,(q,x)
                if q['t'] in 'AB': assert base(x) not in {base(a) for a in q['acc']},(q,x)
        if q['t']=='R':
            # distractor questions must not accept the shown answer
            for j,x in enumerate(q['o']):
                if j!=q['c']:
                    other=[items[k] for k in A if items[k]['q']==x][0]
                    assert q['q'].lower() not in {a.lower() for a in other['ans']}
        srcuse[q['src']]+=1
print('tests ok; items used:',len(srcuse),'of',len(items),'min/max use',min(srcuse.values()),max(srcuse.values()))
print('types',Counter(q['t'] for qs in tests for q in qs))
out=[[{k:q[k] for k in ('t','q','o','c')} for q in qs] for qs in tests]
open(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','questions.js'),'w').write('window.TESTS='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
json.dump(tests,open(__import__('os').path.join(__import__('os').path.dirname(__file__),'tests_full.json'),'w'),ensure_ascii=False,indent=1)
