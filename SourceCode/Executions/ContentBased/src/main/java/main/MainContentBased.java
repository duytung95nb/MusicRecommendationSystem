package main;

import java.util.ArrayList;

import contentbased.ContentBased;
import contentbased.SuggestionManager;
import database.DatabaseConnector;
import database.QueryExecution;

public class MainContentBased {
	
	static final int 	PORT = 9042;
	static final String IP   = "127.0.0.1";
	static final String KEYSPACE = "music_recommendation";

	public static void main(String[] args) {
		String userEventPath = "/home/danh/MusicRecommendation/user_event_test.csv";
		String metadataPath  = "/home/danh/MusicRecommendation/metadata.csv";
		String genreCSVPath	 = "/home/danh/MusicRecommendation/genres.csv";
		String artistCSVPath = "/home/danh/MusicRecommendation/artists.csv";
		String albumCSVPath	 = "/home/danh/MusicRecommendation/albums.csv";
		String composerCSVPath = "/home/danh/MusicRecommendation/composers.csv";
		
		DatabaseConnector databaseConnector = new DatabaseConnector(IP, PORT);
		QueryExecution queryExecution = new QueryExecution(databaseConnector, KEYSPACE);
		
		ContentBased contentBased = new ContentBased(metadataPath, 
					 genreCSVPath, 
					 artistCSVPath, 
					 albumCSVPath, 
					 composerCSVPath,
					 userEventPath);
		
		SuggestionManager suggestionForGenre = contentBased.getSuggestionForGenre();
		for (Integer userID : suggestionForGenre.getAllUserID()) {
			ArrayList<Integer> musicIDRecommendedList = suggestionForGenre.getAllMusicsForUserID(userID);
			queryExecution.insert("content_based", "id_user", userID, "id_musics", musicIDRecommendedList);
		}

		databaseConnector.close();

	}

}
