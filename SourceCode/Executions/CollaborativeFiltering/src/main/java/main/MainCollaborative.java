package main;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.mllib.recommendation.ALS;
import org.apache.spark.mllib.recommendation.MatrixFactorizationModel;
import org.apache.spark.mllib.recommendation.Rating;

import collaborative.GetNonRatedMusics;
import collaborative.GetRatedMusics;
import collaborative.GetUsersExistInSystem;
import collaborative.MakeUsersMusics;
import collaborative.ParseMetadata;
import collaborative.ParseUserEvent;
import collaborative.SortRatings;
import database.DatabaseConnector;
import database.QueryExecution;
import scala.Tuple2;

public class MainCollaborative {
	static final int 	PORT = 9042;
	static final String IP   = "127.0.0.1";
	static final String KEYSPACE = "music_recommendation";

	public static void main(String[] args) {
		String userEventPath = "/home/danh/MusicRecommendation/user_event_test.csv";
		String metadataPath  = "/home/danh/MusicRecommendation/metadata.csv";
		
		// Set environment
		SparkConf sparkConf = new SparkConf().setAppName("Spark Practice");
		JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);
		
		// Get UserEvent RDD
		JavaRDD<String> userEvents = sparkContext.textFile(userEventPath);
		JavaRDD<Rating> userMusicRates = userEvents.map(new ParseUserEvent());
		
		// Get a model
		int rank 			= 10;
		int numIterations 	= 10;
		double lambda 		= 0.01;
		
		MatrixFactorizationModel model = 
				ALS.train(JavaRDD.toRDD(userMusicRates), rank, numIterations, lambda);
		
		// Get Music Map
		JavaRDD<String> rawMetadata = sparkContext.textFile(metadataPath);
		JavaPairRDD<Integer, String> scaledMetadata = 
				JavaPairRDD.fromJavaRDD(rawMetadata.map(new ParseMetadata()));
		Map<Integer, String> idAndMusicNameMap = new HashMap<Integer, String>();
		for (Tuple2<Integer, String> element : scaledMetadata.collect()) {
			idAndMusicNameMap.put(element._1(), element._2());
		}
		
		// Get all users exist in system
		List<Integer> usersExistInSystemNonUnique = userMusicRates.map(new GetUsersExistInSystem()).collect();
		Set<Integer> usersExistInSystemInSet = new HashSet<Integer>(usersExistInSystemNonUnique);
		List<Integer> usersExistInSystem = new ArrayList<Integer>(usersExistInSystemInSet);
		
		// Get recommendations for all users
		HashMap<Integer, List<Rating>> recommendationForAllUsers = new HashMap<Integer, List<Rating>>();
		for (Integer userID : usersExistInSystem) {
			List<Rating> ratedMusicsOfUser = userMusicRates.filter(new GetRatedMusics(userID)).collect();
			List<Integer> ratedMusicIDsOfUser = new ArrayList<Integer>();
			for (Rating rating : ratedMusicsOfUser) {
				ratedMusicIDsOfUser.add(rating.product());
			}
			if (ratedMusicIDsOfUser.isEmpty()) {
				System.out.println("===========> No ratings provided.");
				sparkContext.close();
				sparkContext.stop();
				return;
			}
			
			JavaPairRDD<Integer, String> nonRatedMusicsOfUser = 
					scaledMetadata.filter(new GetNonRatedMusics(ratedMusicIDsOfUser));
			JavaPairRDD<Integer, Integer> usersMusics = 
					JavaPairRDD.fromJavaRDD(nonRatedMusicsOfUser.map(new MakeUsersMusics(userID)));
			
			
			List<Rating> recommendations = model.predict(usersMusics)
												   .sortBy(new SortRatings(), false, 1)
												   .take(10);
			recommendationForAllUsers.put(userID, recommendations);
		}
		
		DatabaseConnector databaseConnector = new DatabaseConnector(IP, PORT);
		QueryExecution queryExecution = new QueryExecution(databaseConnector, KEYSPACE);
		
		for (Integer userID : recommendationForAllUsers.keySet()) {
			ArrayList<Integer> musicIDRecommendedList = new ArrayList<Integer>();
			for (Rating rating : recommendationForAllUsers.get(userID)) {				
				musicIDRecommendedList.add(rating.product());
			}
			
			queryExecution.insert("collaborative", "id_user", userID, "id_musics", musicIDRecommendedList);
		}
		
		databaseConnector.close();
		
		sparkContext.close();
		sparkContext.stop();
	}

}
