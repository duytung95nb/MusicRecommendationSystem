package database;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.datastax.driver.core.DataType;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.querybuilder.Insert;
import com.datastax.driver.core.querybuilder.QueryBuilder;
import com.datastax.driver.core.querybuilder.Select;
import com.datastax.driver.core.schemabuilder.Create;
import com.datastax.driver.core.schemabuilder.SchemaBuilder;

public class QueryExecution {
	private DatabaseConnector connector;
	private String keyspace;

	// select
	public ResultSet selectAll(String table) {
		Select selectQuery = QueryBuilder.select().all().from(this.keyspace, table);
		ResultSet resultset = this.connector.getSession().execute(selectQuery);
		return resultset;
	}

	public ResultSet selectRowById(String table, String primaryKey, String primaryValue) {
		Select.Where selectQuery = QueryBuilder.select().all().from(this.keyspace, table)
				.where(QueryBuilder.eq(primaryKey, primaryValue));
		System.out.println(selectQuery);
		ResultSet resultset = this.connector.getSession().execute(selectQuery);
		return resultset;
	}

	// Key space is equal with database name
	public QueryExecution(DatabaseConnector connector, String keyspace) {
		this.connector = connector;
		this.keyspace = keyspace;
	}

	// insert is the same as update
	public ResultSet insert(String table, String jsonData) {
		String statement = "INSERT INTO " + this.keyspace + "." + table + " JSON " + jsonData;
		System.out.println(statement);
		ResultSet resultset = connector.getSession().execute(statement);
		return resultset;
	}
	public ResultSet insert(String table, String keyName, int keyValue,String valueName, List<Integer> values) {
		Insert insertQuery  = QueryBuilder.insertInto(this.keyspace, table).value(keyName, keyValue);
		insertQuery = insertQuery.value(valueName, values);
		System.out.println(insertQuery);
		ResultSet resultset = connector.getSession().execute(insertQuery);
		return resultset;
	}

	public ResultSet insertValues(String table, List<String> columnNames, List<Object> values) {
		Insert insertQuery = QueryBuilder.insertInto(this.keyspace, table).values(columnNames, values);
		ResultSet result = this.connector.getSession().execute(insertQuery);
		return result;
	}

	public ResultSet insertValues(String table, String primaryKeyName, String primaryKeyValue,
			Map<String, Integer> data) {
		Insert insertQuery = QueryBuilder.insertInto(this.keyspace, table).value(primaryKeyName, primaryKeyValue);
		for (String columnName : data.keySet()) {
			insertQuery = insertQuery.value(columnName, data.get(columnName));
		}
		System.out.println(insertQuery.toString());
		ResultSet result = this.connector.getSession().execute(insertQuery.toString());
		return result;
	}

	public ResultSet insertValues_String(String table, String primaryKeyName, String primaryKeyValue,
			Map<String, String> data) {
		Insert insertQuery = QueryBuilder.insertInto(this.keyspace, table).value(primaryKeyName, primaryKeyValue);
		for (String columnName : data.keySet()) {
			insertQuery = insertQuery.value(columnName, data.get(columnName));
		}
		System.out.println(insertQuery.toString());
		ResultSet result = this.connector.getSession().execute(insertQuery.toString());
		return result;
	}

	// create table
	public ResultSet createTable(String tableName, String primaryKey, DataType primaryDatatype,
			List<String> columnNames, DataType columnsDataType) {
		Create create = SchemaBuilder.createTable(this.keyspace, tableName).ifNotExists().addPartitionKey(primaryKey,
				primaryDatatype);
		for (String columnName : columnNames) {
			create = create.addColumn(columnName, columnsDataType);
		}
		ResultSet result = this.connector.getSession().execute(create);
		
		return result;
	}
}