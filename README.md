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
Metodo | Rotta | Tipologia Utente | Autenticazione JWT | 
--- | --- | --- | --- |
POST | /user/signup | guest | NO |
POST | /user/login | user/admin | NO |
GET | /user/residualToken | user/admin | YES |
POST | /user/updateToken | admin | YES |
POST | /model/create | user/admin | YES |
POST | /model/loadFile | user/admin | YES |
GET | /model/list | user/admin | YES |
PUT | /model/updateMetadata | user/admin | YES |
PUT | /model/updateFile | user/admin | YES |
DELETE | /model/delete | user/admin | YES |
POST | /model/inference | user/admin | YES |
PUT | /dataset/create | user/admin | YES |
PUT | /dataset/update | user/admin | YES |
GET | /dataset/list | user/admin | YES |
DELETE | /dataset/delete | user/admin | YES |
POST | /dataset/zip | user/admin | YES |
POST | /dataset/image | user/admin | YES |
POST | /dataset/label | user/admin | YES |
POST | /dataset/labelList | user/admin | YES |

## Descrizione rotte 

### /user

#### Signup

Rotta attraverso la quale è possibile registrarsi nel sito inserendo i parametri opportuni. Nel caso in cui uno di essi non sia presente verrà restituito un messaggio di errore con codice 400 specificando il parametro che ha sollevato l'eccezione. In caso di inserimento di un username già in uso, verrà restituito un errore con codice 409. Se l'operazione va a buon fine l'utente viene registrato nel database. 

#### Signup


# Configurazione

## Avvio del progetto

Per avviare il progetto è necessario eseguire, posizionandosi nella directory di progetto:

```
cd dataset-manager
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up 
```

## Testing 

Esempi di chiamate:



