import re
L={}
def add(fam, words):
    for w in words.split('|'):
        w=w.strip()
        if w: L[w]=fam
add('F','alcohol|ananas|appels|bananen|bier|brood|cola|fruit|groente|kaas|kip|koekjes|koffie|komkommer|mango|melk|patat|peer|pizza|rijst|spaghetti|suiker|thee|tomaat|tomaten|vlees|water|yoghurt|een appel|sigaretten|taart|soep|vis')
add('A','dieren|katten|kikkers|kippen|koeien|leeuwen|olifanten|slangen|tijgers|een kat|bomen')
add('B','been|buik|hoofd|mond|rug|tanden|voet')
add('C','broek|een broek|jas|jassen|schoenen|t-shirt')
add('T','auto|de auto|bus|de bus|fiets|de fiets|e-bike|metro|taxi|trein|de trein|een auto|een fiets|een trein|andere auto|auto’s|bussen|treinen|de boot|met auto|met bus|met de bus|met de fiets|met fiets|met trein|in een bus|in trein|met de auto|met de trein|met de taxi')
add('P','baas|baby|familie|haar kind|haar partner|het kind|jongen|kind|kinderen|man|mannen|maria|meisje|mensen|moeder|mijn broer|mijn docent|mijn konijn|mijn man|mijn oma|mijn ouders|mijn partner|mijn zus|ouders|partner|tante|vader|vriend|vriendin|vrienden|vrouw|zus|zijn kinderen|zijn moeder|zijn partner|zijn vrouw|buitenlanders|dokters|de koningin|de prinses|de minister|de dokter|de leraar|de lerares|een partner|een vrouw|veel mensen|de politie|met broer|met moeder|met vader|met vrienden|met zijn vrouw|met zus|bij mijn partner|bij ouders|bij familie|gemeente|de school|naar familie|naar vriend|naar zijn vriend|naar michael jackson|de monteur|zijn moeder')
add('J','arts|artiest|dokter|kapper|leraar|schoonmaker|specialist|verpleegster|zanger|tandarts|administratie|alles is goed')
add('L','bioscoop|buiten|huis|kerk|markt|restaurant|school|winkel|ziekenhuis|zwembad|uitzendbureau|werk|de stad|het centrum|het café|de kroeg|het park|de garage|de keuken|de winkel|een andere stad|een winkel|een ziekenhuis|in de kast|in de stad|in de tuin|in de winkel|in huis|in restaurant|in supermarkt|in winkel|in het ziekenhuis|in bed|op de kast|op de markt|op school|op straat|naast het bed|thuis|niet thuis|boekwinkel|mediamarkt|apple|zee|het water|zijn werk|de televisie|de stad|tuin|balkon|flat|groot huis|mooi huis|klein huis|ander huis|een ander huis|nieuw huis|op internet|op de radio|op de televisie|naar een auto|naar tuin|weg|in amerika|in amsterdam|in assen|in rottum|garage schoon|de dorst')
add('G','amsterdam|assen|rottum|hoogeveen|rio|rio de janeiro|djakarta|moskou|tokyo|istanbul|bangkok|japan|syrië|thailand|indonesië|amerika|nederland|rusland|turkije|afrika|dorpstraat 2|0645310799')
add('X','engels|arabisch|japans|portugees|nederlands|nederlandse taal')
add('Q','altijd|nooit|bijna nooit|elke dag|heel vaak|elk weekend|ook elke dag|1 keer per jaar|in de nacht|in het weekend|in weekend|op zaterdag|van negen tot vijf|morgen|volgende week|over drie maanden|zes uur|zeven uur|tien uur|maandag|dinsdag|woensdag|januari|februari|maart|lente|nacht|twee keer|tien keer|tien jaar|op 2 februari 1973|vakantie|mooi weer|67 jaar')
add('N','twee|vijf|tien|vijftien')
add('M','snel|langzaam|laat|te laat|veel|weinig|niet veel|sneller|alleen|slecht|niet|snel lopen')
add('E','dom|donker|druk|duur|gevaarlijk|gezellig|gezond|niet gezond|goed|grijs|groot|interessant|jarig|kapot|klaar|klein|kort|lang|lekker|lelijk|leuk|lief|makkelijk|moe|moeilijk|mooi|normaal|niet blij|niet boos|niet goed|niet lekker|niet leuk|niet mooi|niet ziek|oud|prima|rond|rood|rustig|saai|spannend|stil|super|uitstekend|verdrietig|vies|warm|wit|zwart|blauw|zoet|ziek|blij|boos|moe|mooi werk|dat weet ik niet|nederland is mooi|voor controle|alles')
# remaining -> S (things/media/school) or V (verbs/activities)
add('S','honger|pijn|zin|tijd|boek|boeken|een boek|het boek|zijn boek|krant|de krant|test|een test|toets|een toets|toetsen|examen|diploma|huiswerk|informatie|muziek|popmuziek|klassieke muziek|piano|gitaar|viool|bal|tas|een pen|pennen|brief|e-mail|sms|appje|cadeau|een cadeau|zoen|een zoen|een kus|knuffel|medicijnen|paracetamol|pil|pillen|recept|een bril|stoel|een stoel|tafel|matras|dak|muren|ramen|deuren|een tuin|salaris|extra salaris|extra vakantie|veel geld|politiek|natuur|liefde|portret|een verhaal|mooie foto|veel foto’s|studie|de les|les|veel dingen|de koningin|nieuw dak|vier muren|tien kamers|het boek|een auto|voetbal|gezondheid|kinderen|mooi werk|ander werk|beter werk|studie')
L['mooi werk']='E'
def fam(a):
    w=a.lower()
    if w in L: return L[w]
    if re.match(r'^naar ',w): return 'L'
    if re.match(r'^(op reis|op vakantie)$',w): return 'V'
    return 'V'
