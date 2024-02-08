package plugin

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data/sqlutil"

	"database/sql"
	_ "github.com/MonetDB/MonetDB-Go/v2"
)

// Make sure Datasource implements required interfaces. This is important to do
// since otherwise we will only get a not implemented error response from plugin in
// runtime. In this example datasource instance implements backend.QueryDataHandler,
// backend.CheckHealthHandler interfaces. Plugin should not implement all these
// interfaces - only those which are required for a particular task.
var (
	_ backend.QueryDataHandler      = (*Datasource)(nil)
	_ backend.CheckHealthHandler    = (*Datasource)(nil)
	_ instancemgmt.InstanceDisposer = (*Datasource)(nil)
)

// NewDatasource creates a new datasource instance.
func NewDatasource(_ context.Context, settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	log.DefaultLogger.Debug("monetdb: create new datasource")
	dsn := Dsn(&settings)

	mDB := &sql.DB{}

	db, err := sql.Open("monetdb", dsn)
	if err != nil {
		log.DefaultLogger.Error("monetdb: cannot open database connection %s", err.Error())
	} else {
		mDB = db
		mDB.SetConnMaxIdleTime(6 * time.Hour)
		log.DefaultLogger.Debug("monetdb: store MonetDB SQL DB Connection")
	}

	return &Datasource{
		dsn: dsn,
		mDB: mDB,
	}, nil
}

// Datasource is an example datasource which can respond to data queries, reports
// its health and has streaming skills.
type Datasource struct{
	dsn string;
	mDB *sql.DB;
}

// Dispose here tells plugin SDK that plugin wants to clean up resources when a new instance
// created. As soon as datasource settings change detected by SDK old datasource instance will
// be disposed and a new one will be created using NewSampleDatasource factory function.
func (d *Datasource) Dispose() {
	// Clean up datasource instance resources.
	d.mDB.Close()
}

type dataModel struct {
	Username string `json:"username"`;
	Hostname string `json:"hostname"`;
	Port int `json:"port"`;
	Database string `json:"database"`;
}

func Dsn(req *backend.DataSourceInstanceSettings) string {
	log.DefaultLogger.Debug("monetdb: generate DSN")

	var jsonData dataModel
	var dataError = json.Unmarshal(req.JSONData, &jsonData)

	if dataError != nil {
		log.DefaultLogger.Error("monetdb: could not unmarshal database settings")
	}

	var username = "monetdb"
	var hostname = "localhost"
	var port = 50000
	var database = "monetdb"
	var password_dec string

	if jsonData.Username != "" { username = jsonData.Username }
	if jsonData.Hostname != "" { hostname = jsonData.Hostname }
	if jsonData.Port != 0 {port = jsonData.Port}
	if jsonData.Database != "" { database = jsonData.Database }

	if password, exists := req.DecryptedSecureJSONData["password"]; exists {
	  password_dec = password
	} else {
		password_dec = "monetdb"
	}
	return fmt.Sprintf("%s:%s@%s:%d/%s", username, password_dec, hostname, port, database)
}

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifier).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (d *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	log.DefaultLogger.Debug("monetdb: query the database")

	response := backend.NewQueryDataResponse()
	// loop over queries and execute them individually.
	for _, q := range req.Queries {
		res := d.query(ctx, req.PluginContext, q)
		// save the response in a hashmap
		// based on with RefID as identifier
		response.Responses[q.RefID] = res
	}

	return response, nil
}

type queryModel struct{ Querytext string `json:"queryText"` }

func (d *Datasource) query(_ context.Context, pCtx backend.PluginContext, query backend.DataQuery) backend.DataResponse {
	log.DefaultLogger.Debug("monetdb: execute the query")
	var response backend.DataResponse

	// Unmarshal the JSON into our queryModel.
	var qm queryModel
	err := json.Unmarshal(query.JSON, &qm)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("monetdb: json unmarshal: %s", err.Error()))
	}
// 		if len(strings.TrimSpace(string(q.JSON))) > 0 {}

	rows, err := d.mDB.Query(qm.Querytext)
	if err != nil {
		// Do not return the dsn in the error message, because it contains the password in cleartext
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("monetdb: cannot run query %s with error %s", qm.Querytext, err.Error()))
	}
	if rows != nil {
		log.DefaultLogger.Debug("monetdb: rows created")
	}
	defer rows.Close()

	frame, err := sqlutil.FrameFromRows(rows, -1)
	if err != nil {
		log.DefaultLogger.Error("monetdb: could not convert resultset to frame: %s", err.Error())
		response.Error = err
		return response
	}

	response.Frames = append(response.Frames, frame)

	return response
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (d *Datasource) CheckHealth(_ context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	log.DefaultLogger.Debug("monetdb: check database connection")
	var status = backend.HealthStatusOk
	var message = "Data source is working"

	_, err := d.mDB.Query("SELECT 1")
	if err != nil {
		// Do not log the dsn as debug information, since it contains the password in plaintext
		log.DefaultLogger.Error(fmt.Sprintf("monetdb: health check failed: %s", err.Error()))

		status = backend.HealthStatusError
		message = fmt.Sprintf("Health check failed: %s", err.Error())
	}

	return &backend.CheckHealthResult{
		Status:  status,
		Message: message,
	}, nil
}
