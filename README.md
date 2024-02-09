# monetdb-grafana-datasource

## Contributing

You can contribute to the development of this plugin by filing an issue or submitting a pull request on [github](https://github.com/dataspex/monetdb-grafana/)

## Authors

This plugin was developed by [Dataspex](https://www.dataspex.nl/). Many thanks to the [MonetDB](https://www.monetdb.org/) team for developing the MonetDB database system.

## License

This software is licensed under the [GNU General Public License v3.0 or later](LICENSE)

## Limitations

This is the first version of the plugin. Several features are not implemented yet:
- No support for entering multiple queries, only the resultset of the first query is returned.
- No support for wide dataframes.
- Several MonetDB features are not supported, because the MonetDB-Go driver does not support them.
- An advanced query editor, with schema support, is not implemented.

## Usage

You can add a datasource by using the "Data sources" option in the "Administration" menu:
![Add data source](/img/add-datasource.png)
And you can add new connections in the "Connections" menu and search for "monetdb":
![Add new connection](/img/add-new-connection.png)
When you select "MonetDB" you wil be presented with the "Readme":
![Create data source](/img/create-datasource.png)
You can find the configured data sources in the "Connections" menu:
![Data sources](/img/datasources.png)
When you open a data source, you can change the configuration:
![Settings](/img/configuration.png)
You can find the defined dashboards in the "Dashboards" menu:
![Dashboards](/img/dashboards.png)

## Development

### Docker compose

The docker compose file creates three containers, one for Grafana, one for MonetDB and one that creates a dataset for testing. Please note that we publish port 4000 for the grafana frontend, not the default port of 3000. The reason is that this plugin was developed using cloud hosted version of VS code. That already published port 3000. The database container is the latest version of the MonetDB container image from [dockerhub](https://hub.docker.com/r/monetdb/monetdb). To connect to the database, use the default settings for MonetDB. See the example [datasource](/provisioning/datasources/monetdb.yaml) for the values.

You can login to the running MonetDB instance by opening a shell in the running container. First, find the "CONTAINER_ID" by running ```docker ps```. Then connect to that container and run "mclient", the monetdb client tool:
```
user@localhost:~/git/dataspex-monetdb-grafana-datasource $ docker exec -it CONTAINER_ID /bin/bash
[root@ac2caf1fe9f0 /]# mclient monetdb
user:monetdb
password:
Welcome to mclient, the MonetDB/SQL interactive terminal (Dec2023)
Database: MonetDB v11.49.1 (Dec2023), 'mapi:monetdb://ac2caf1fe9f0:50000/monetdb'
FOLLOW US on https://twitter.com/MonetDB or https://github.com/MonetDB/MonetDB
Type \q to quit, \? for a list of available commands
auto commit mode: on
sql>select * from dataset;
+----------------------------------+--------------------------+
| thistime                         | value                    |
+==================================+==========================+
| 2024-02-08 07:05:13.363124+00:00 |                       42 |
| 2024-02-08 07:21:46.616747+00:00 |                       42 |
+----------------------------------+--------------------------+
2 tuples
sql>
```

### Testing

Howto build and develop a Grafana data source backend plugin is explained in the [documentation](https://grafana.com/developers/plugin-tools/tutorials/build-a-data-source-backend-plugin). This plugin was developed using the Grafana [create-plugin tool](https://www.npmjs.com/package/@grafana/create-plugin). You need to clone the repository and then go into that directory. Then you need to run the following commands to start grafana with the MonetDB plugin:

First, build the plugin backend (using Go)
``` bash
mage -v build:linux
```
Then install the frontend dependencies
``` bash
npm install
```
Then build the frontend plugin
``` bash
npm run dev
```
And in another terminal, start Grafana and a MonetDB server
``` bash
npm run server
```
Then you can open the Grafana webinterface in your browser.

### Example

The "provisioning" directory contains an example dasboard with the related datasource and plugin definition to illustrate how to use this datasource plugin. It uses data from a table called "dataset". This table contains a timeseries for the period of one hour, ending at the moment the dataset was created. It contains datapoints for each second, a random integer. If needed, you could change the initial value of the "step" variable in the stored procedure in the [sql script](/provisioning/dataset/dataset.sql).

The dashboard is named "MonetDB-test-dashboard" and available on the dashboard menu. The datasource is available at the connections -> data sources menu. You can add a new connection by searching for the "MonetDB" plugin.

