# AI2 Textbook Annotation Tool (TAT)

Allows a user to annotate text blobs identified in scanned textbook pages. Assignment to one of several pre-defined categories is possible.

Pages and annotations are stored in a PostgreSQL database. The client is implemented in React.js and communicates
to a REST API implemented using Flask to persist the annotations to the database.

## Development

### Dependencies

* [nodejs](https://nodejs.org)
* [postgresql](http://www.postgresql.org)

### Getting Started

1. `brew install postgresql` (Install [postgresql](http://www.postgresql.org))
2. `pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start`
3. `createdb vision-dev`
4. `createuser ai2service`
5. `brew install node` (Install [nodejs](https://nodejs.org))
6.  fork https://github.com/allenai/diagram-annotation
7. `git clone git@github.com:yourusername/diagram-annotation`
8. `sbt flywayMigrate`
9. `sbt`
10. `sbt> ~reStart`

Once the build has finished, open `http://localhost:8080`

## Deployment


## Questions?


