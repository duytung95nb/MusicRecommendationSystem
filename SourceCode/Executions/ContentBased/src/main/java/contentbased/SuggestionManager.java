package contentbased;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

public class SuggestionManager {
	private int _numberOfSuggestion;
	private HashMap<Integer, HashMap<Integer, Double>> _rank;
	
	public SuggestionManager(int numberOfSuggestion) {
		_numberOfSuggestion = numberOfSuggestion;
		_rank = new HashMap<Integer, HashMap<Integer,Double>>();
	}
	
	public void put(Suggestion suggestion) {
		Integer idUser = suggestion.getIDUser();
		Integer idMusic = suggestion.getIDMusic();
		Double	prediction = suggestion.getPrediction();
		
		if (_rank.containsKey(idUser)) {
			HashMap<Integer, Double> predictionOfMusic = _rank.get(idUser);
			int numberOfSuggestion = predictionOfMusic.size();
			
			if (numberOfSuggestion < _numberOfSuggestion) {
				predictionOfMusic.put(idMusic, prediction);
			}
			else if (numberOfSuggestion == _numberOfSuggestion) {
				Double minValue = Collections.min(predictionOfMusic.values());
				
				if (prediction > minValue) {
					Integer minIndex = null;
					for (Integer idMusicIter : predictionOfMusic.keySet()) {
						if (predictionOfMusic.get(idMusicIter) == minValue) {
							minIndex = idMusicIter;
							break;
						}
					}
					predictionOfMusic.remove(minIndex);
					
					predictionOfMusic.put(idMusic, prediction);
				}
			}
		}
		else {
			HashMap<Integer, Double> predictionOfMusic = new HashMap<Integer, Double>();
			predictionOfMusic.put(idMusic, prediction);
			_rank.put(idUser, predictionOfMusic);
		}
	}
	
	public void display() {
		for (Integer idUser : _rank.keySet()) {
			System.out.println("ID User: " + idUser);
			System.out.println("======================");
			
			HashMap<Integer, Double> predictionOfMusic = _rank.get(idUser);
			for (Integer idMusic : predictionOfMusic.keySet()) {
				System.out.println("ID Music: " + idMusic + ", Pred: " + predictionOfMusic.get(idMusic));
			}
		}
	}
	
	public ArrayList<Integer> getAllUserID() {
		ArrayList<Integer> ret = new ArrayList<Integer>();
		for (Integer userID : _rank.keySet()) {
			ret.add(userID);
		}
		return ret;
	}
	
	public ArrayList<Integer> getAllMusicsForUserID(Integer userID) {
		ArrayList<Integer> ret = new ArrayList<Integer>();
		
		for (Integer musicID : _rank.get(userID).keySet()) {
			ret.add(musicID);
		}
		
		return ret;
	}
}
