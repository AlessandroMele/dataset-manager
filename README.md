# Dataset Manager

# Team Work
- Mele Alessandro
- Traini Davide

# Requisiti
- Docker;
- Node.JS
- Postman;

# Descrizione ed obiettivi di progetto
Si realizzi un sistema che consenta di gestire dati circa attività di annotazione di data-set ed inferenza a partire da modelli pre-addestrati. Devono essere predisposte le seguenti rotte:<br />
- [U] + Creazione di un data-set (fornire metadati minimi come nome ed una serie di tag sotto forma di lista di parole e numero di classi); all’inizio il data-set risulta vuota.
- [U] Cancellazione (logica) di un data-set
- [U] + Ottenere la lista dei data-set
- [U] Aggiornamento di un data-set (con verifica della non sovrapposizione con progetti dello stesso utente con lo stesso nome)
- [U] Inserimento di contenuti all’interno del data-set
    - Caricamento di una immagine
    - Caricamento di un zip contenti immagini
    - Per ogni immagine caricata deve essere restituito un uuid che consente poi di associare all’immagine una o più label (nel casto di upload da zip si restituisca una lista di uuid o similare a scelta degli studenti.
    * Il costo associato ad ogni immagine è di 0.1token; deve essere verificato se il credito disponibile è sufficiente a gestire la richiesta.
- [U] Creazione di una o più label per una immagine
    * Per ogni etichetta prevedere la possibilità di associare anche il bounding box;necessario per ogni etichetta specificare la classe.
    * Per ogni label si applica un costo di 0.05token; deve essere verificato se il credito disponibile è sufficiente a gestire la richiesta.
- [U] Estendere la chiamata sopra al caso di più immagini
- [U] + Creazione di un modello (fornire metadati minimi come nome ed il rif. al data-set)
- [U] + Caricamento di un file di modello associato ad modello creato.
- [U] Cancellazione (logica) di un modello
- [U] + Ottenere la lista dei modelli
- [U] + Aggiornamento di un modello (con verifica della non sovrapposizione con modelli dello stesso utente con lo stesso nome); aggiornamento può essere sui metadati o sul file del modello.
- [U] Effettuare una inferenza su una immagine che viene passata al back-end; l’utente specifica l’id
  del modello da usare (nel vostro caso si usi come rete quella dell’esame di CV&DL). Restituire JSON contenente i dettagli dell’inferenza (es. classe o lista di bbox)
  
    * Ogni richiesta di inferenza ha un costo di 5 token. L’inferenza ha luogo se i crediti associati all’utente sono sufficienti.
- [U] + Restituire il credito residuo di un utente (necessaria autenticazione mediante token JWT)
dove [U] corrisponde ad una rotta autenticata mediante JWT.

I dati di cui sopra devono essere memorizzati in un database esterno interfacciato con Sequelize. <br />La scelta del DB è a discrezione degli studenti. <br />
Le richieste devono essere validate.<br />
Ogni utente autenticato (ovvero con JWT) ha un numero di token (valore iniziale impostato nel seed del database).<br />
Nel caso di token terminati ogni richiesta da parte dello stesso utente deve restituire 401 Unauthorized.<br />
+ Prevedere una rotta per l’utente con ruolo admin che consenta di effettuare la ricarica per un utente fornendo la mail ed il nuovo “credito” (sempre mediante JWT).<br />
Il numero residuo di token deve essere memorizzato nel db sopra citato. <br />
Si deve prevedere degli script di seed per inizializzare il sistema.<br />
Si chiede di utilizzare le funzionalità di middleware.<br />
Si chiede di gestire eventuali errori mediante gli strati middleware sollevando le opportune eccezioni.<br />
Si chiede di commentare opportunamente il codice.<br />

# Progettazione

## Diagrammi UML
### Diagramma dei casi d'uso
<img src = "UML/use_case_diagram.png">

### Diagramma strutturale

<img src = "UML/DiagrammaProgetto.png">

## Pattern utilizzati

## Factory

## Singleton

## Middleware

# Rotte
Metodo | Rotta | Tipologia Utente | Autenticazione JWT | Body della richiesta|
--- | --- | --- | --- | --- |
POST | /user/signup | guest | NO | JSON |
POST | /user/login | user/admin | NO | JSON |
GET | /user/residualToken | user/admin | YES | JSON |
POST | /user/updateToken | admin | YES | JSON |
POST | /model/create | user/admin | YES | JSON |
POST | /model/loadFile | user/admin | YES | FORM |
GET | /model/list | user/admin | YES | JSON |
PUT | /model/updateMetadata | user/admin | YES | JSON |
PUT | /model/updateFile | user/admin | YES | FORM |
DELETE | /model/delete | user/admin | YES | JSON |
POST | /model/inference | user/admin | YES | JSON |
PUT | /dataset/create | user/admin | YES | JSON |
PUT | /dataset/update | user/admin | YES | JSON |
GET | /dataset/list | user/admin | YES | JSON |
DELETE | /dataset/delete | user/admin | YES | JSON |
POST | /dataset/zip | user/admin | YES | FORM |
POST | /dataset/image | user/admin | YES | FORM |
POST | /dataset/label | user/admin | YES | JSON |
POST | /dataset/labelList | user/admin | YES | JSON |

## Descrizione rotte 

### /user

#### /signup

Rotta attraverso la quale è possibile registrarsi nel sito inserendo i parametri opportuni. Nel caso in cui uno di essi non sia presente verrà restituito un messaggio di errore con codice 400 specificando il parametro che ha sollevato l'eccezione. In caso di inserimento di un username già in uso, verrà restituito un errore con codice 409. Se l'operazione va a buon fine l'utente viene registrato nel database. 

Esempio di richiesta:

```json
{
    "email": "franco.rossi@hotmail.it",
    "username": "franco",
    "password": "secret"
}
```

#### /login

Rotta attraverso la quale è possibile generare un proprio JWT attraverso il quale autenticare le proprie chiamate. Per far ciò è necessario passare nel body le informazioni opportune, in caso di mancanza di esse verrà restituito un errore che definisce le informazioni mancanti. Nel caso in cui le informazioni non corrispondono a nessuno degli utenti registrati nel database verrà restituito un messaggio con codice 400 
In caso di successo verranno restituite le informazioni relative al token generato.

Esempio di richiesta:


```json
{
    "email": "admin@admin.it",
    "username": "admin",
    "role":"admin",
    "password": "password1"
}
```


#### /residualToken

Rotta attravero la quale l'utente può accedere al numero di token rimasti. Non sono necessari parametri nella richiesta


#### /updateToken

Rotta attraverso la quale l'admin ha la possibilità di aggiornare il numero di token in possesso di uno degli altri utenti registrati. Per far ciò è necessario inserire lo username dell'utente; nel caso in cui non sia presente nessun utente con tale username, sarà restituito un errore con codice 404

Esempio di richiesta:


```json
{
    "username": "user",
    "token": 80
}
```

### /model


#### /create 

Rotta attraverso la quale è possible creare un nuovo modello fornendo le opportune informazioni. Nel caso in cui esse non siano presenti verrà restituito un errore con codice 400 contenete informazioni sul dato mancante. Verranno inoltre sollevate delle eccezioni nel caso in cui l'utente abbia già un modello con lo stesso nome e nel caso in cui l'utente fornisca un datasetName che non corrisponde a nessuno dei dataset da lui posseduti. 

Esempio di richiesta:


#### /loadFile

Rotta attraverso la quale è possibile caricare un file ed associarlo ad uno specifico modello. Se le informazioni necessarie non sono inserite viene restituito un errore con codice 400. Se il modelName fornito dall'utente non corrisponde a nessuno dei suoi modelli allora viene restituito un errore con codice 404. Nel caso in cui è già presente un file per il modello selezionato, sarà restituito un errore con codice 409

Esempio di richiesta:


#### /updateFile

Rotta attraverso la quale è possibile caricare un file ed associarlo ad uno specifico modello. Se le informazioni necessarie non sono inserite viene restituito un errore con codice 400. Se il modelName fornito dall'utente non corrisponde a nessuno dei suoi modelli allora viene restituito un errore con codice 404. Nel caso in cui non sia già presente un file per il modello selezionato, sarà restituito un errore con codice 404

Esempio di richiesta:


#### /list

Rotta attraverso la quale l'utente può ottenere la lista dei propri modelli. Nel caso in cui l'utente non abbia alcun modello verrà restituito un errore con codice 404. Tale rotta non necessita di alcun parametro.


#### /updateMetadata

Rotta attraverso la quale è possibile aggiornare le informazioni di un modello. I campi che possono essere aggiornati sono il nome del modello ed il dataset a cui esso è associato . Se il nuovo nome del modello corrisponde ad uno dei modelli dell'utente allora viene restituito un errore con codice 409. Se il nome del dataset non corrisponde con nessuno dei dataset dell'utente viene restituito un errore con codice 404. 

Esempio di richiesta:


#### /delete


Rotta attraverso la quale un utente può eliminare un proprio modello con uno specifico nome. Se l'utente non ha alcun modello con come uguale a quello definito viene restituito un errore con codice 404. La rimozione è logica, quindi il modello rimane salvato nel database, ma l'utente non ha più la possibilità di accederci.

Esempio di richiesta:


#### /inference


### /dataset


#### /create

Rotta attraverso la quale è possible creare un nuovo dataset fornendo le opportune informazioni. Nel caso in cui esse non siano presenti verrà restituito un errore con codice 400 contenete informazioni sul dato mancante. Verranno inoltre sollevate delle eccezioni nel caso in cui l'utente abbia già un dataset con lo stesso nome. 

Esempio di richiesta:


#### /update

Rotta attraverso la quale è possibile aggiornare le informazioni di un dataset. I campi che possono essere aggiornati sono il nome del datasetle keywords associate ed il numero di classi. Se il nuovo nome del dataset corrisponde ad uno dei dataset dell'utente allora viene restituito un errore con codice 409.

Esempio di richiesta:


#### /list

Rotta attraverso la quale l'utente può ottenere la lista dei propri dataset. Nel caso in cui l'utente non abbia alcun dataset verrà restituito un errore con codice 404. Tale rotta non necessita di alcun parametro. Il JSON restituito dal server contiene informazioni riguardo il dataset e le immagini che lo compongono, ognuna con le rispettive labels  

Esempio di richiesta:


#### /delete

Rotta attraverso la quale un utente può eliminare un proprio dataset con uno specifico nome. Se l'utente non ha alcun dataset con come uguale a quello definito viene restituito un errore con codice 404. La rimozione è logica, quindi il dataset rimane salvato nel database, ma l'utente non ha più la possibilità di accederci, inoltre vengono eliminate in cascata le immagini e ele keywords associate al dataset.

Esempio di richiesta:


#### /zip

Rotta attraverso la quale un utente inserisce uno zip contenente immagini da inserire in uno specifico dataset. Nel caso in cui il dataset specificato non esista viene restituito un errore con codice 404. Nel caso in cui l'utente non disponga dei crediti sufficienti per inserire le immagini viene restituito un errore con codice 401. Se lo zip non contiene interamente immagini viene restituito errore

#### /image

Rotta attraverso la quale un utente inserisce un'immagini da inserire in uno specifico dataset. Nel caso in cui il dataset specificato non esista viene restituito un errore con codice 404. Nel caso in cui l'utente non disponga dei crediti sufficienti per inserire l'immagini viene restituito un errore con codice 401. Se il file inserito non è un'immagini viene restituito errore.

#### /label

Rotta attraverso la quale l'utente può associare un'etichetta ad una specifica immagine. Se l'immagine non esiste viene restituito un errore con codice 404. L'utente può decidere se inserire solamente l'etichetta di classe o se inserire anche un bounding box definito attraverso 3 paremetri: altezza, larghezza e centro; tali parametri sono opzionali, ma se inseriti devono essere presenti necessariamente tutti e 3 e devono essere compresi tra 0 ed 1, altrimenti viene restituito un errore con codice 400.

Esempio di richiesta:


#### /labelList

Rotta attraverso la quale l'utente può associare una lista di etichette ad una specifica immagine. Se l'immagine non esiste viene restituito un errore con codice 404. Per ogni elemento dell'array l'utente può decidere se inserire solamente l'etichetta di classe o se inserire anche un bounding box definito attraverso 3 paremetri: altezza, larghezza e centro; tali parametri sono opzionali, ma se inseriti devono essere presenti necessariamente tutti e 3 e devono essere compresi tra 0 ed 1, altrimenti viene restituito un errore con codice 400.


Esempio di richiesta:








# Configurazione

## Avvio del progetto

Per avviare il progetto è necessario eseguire, posizionandosi nella directory di progetto:

```
cd dataset-manager
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up 
```

## Testing 

Esempi di chiamate:



