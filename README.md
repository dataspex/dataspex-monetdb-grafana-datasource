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
- A advanced query editor, with schema support, is not implemented.

## Development

### Testing

The "provisioning" directory contains an example dasboard with the related datasource and plugin definition to illustrate how to use this datasource plugin.

### Docker compose

The docker compose file creates two containers, one for Grafana and one for MonetDB. Please note that we publish port 4000 for the grafana frontend, not the default port of 3000. The reason is that this plugin was developed using cloud hosted version of VS code. That already published port 3000.
