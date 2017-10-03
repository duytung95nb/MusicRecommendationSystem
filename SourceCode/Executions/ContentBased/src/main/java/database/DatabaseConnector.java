package database;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Host;
import com.datastax.driver.core.Metadata;
import com.datastax.driver.core.Session;

public class DatabaseConnector {
	private Cluster cluster;
	private Session session;

	public Cluster getCluster() {
		return cluster;
	}

	public void setCluster(Cluster cluster) {
		this.cluster = cluster;
	}

	public Session getSession() {
		return session;
	}

	public void setSession(Session session) {
		this.session = session;
	}

	public DatabaseConnector(String node, int port) {
		this.cluster = Cluster.builder().addContactPoint(node).withPort(port).build();
		Metadata metadata = cluster.getMetadata();
		System.out.println("Connected to cluster: " + metadata.getClusterName());
		for (Host host : metadata.getAllHosts()) {
			System.out.printf("Data center %s, host %s, rack %s \n", host.getDatacenter(), host.getAddress(),
					host.getRack());
		}
		this.session = this.connect();
	}

	public Session connect() {
		return this.cluster.connect();
	}

	public void close() {
		this.cluster.close();
	}

}
