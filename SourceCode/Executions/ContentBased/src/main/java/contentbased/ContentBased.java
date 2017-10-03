package contentbased;

import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import au.com.bytecode.opencsv.CSVReader;
import au.com.bytecode.opencsv.CSVWriter;

public class ContentBased {
	private final int ARTIST 	= 2;
	private final int COMPOSER 	= 3;
	private final int ALBUM 	= 4;
	private final int GENRE 	= 5;
	
	private String _metadataPath;
	private String _genreCSVPath;
	private String _artistCSVPath;
	private String _albumCSVPath;
	private String _composerCSVPath;
	private String _userEventPath;
	
	private HashMap<Integer, ArrayList<Integer>> _mapUserEvent;

	private HashMap<Integer, String> _mapGenresIDBased;
	private HashMap<Integer, String> _mapArtistsIDBased;
	private HashMap<Integer, String> _mapAlbumsIDBased;
	private HashMap<Integer, String> _mapComposersIDBased;
	
	private HashMap<String, Integer> _mapGenresValueBased;
	private HashMap<String, Integer> _mapArtistsValueBased;
	private HashMap<String, Integer> _mapAlbumsValueBased;
	private HashMap<String, Integer> _mapComposersValueBased;

	private Integer[] _dfOfGenre;
	private Integer[] _dfOfArtist;
	private Integer[] _dfOfAlbum;
	private Integer[] _dfOfComposer;

	private Double[] _idfOfGenre;
	private Double[] _idfOfArtist;
	private Double[] _idfOfAlbum;
	private Double[] _idfOfComposer;

	private HashMap<Integer, Double[]> _tfMatrixOfGenre;
	private HashMap<Integer, Double[]> _tfMatrixOfArtist;
	private HashMap<Integer, Double[]> _tfMatrixOfAlbum;
	private HashMap<Integer, Double[]> _tfMatrixOfComposer;

	private HashMap<Integer, Double[]> _itemMatrixOfGenre;
	private HashMap<Integer, Double[]> _itemMatrixOfArtist;
	private HashMap<Integer, Double[]> _itemMatrixOfAlbum;
	private HashMap<Integer, Double[]> _itemMatrixOfComposer;

	private HashMap<Integer, Double[]> _userProfileMatrixOfGenre;
	private HashMap<Integer, Double[]> _userProfileMatrixOfArtist;
	private HashMap<Integer, Double[]> _userProfileMatrixOfAlbum;
	private HashMap<Integer, Double[]> _userProfileMatrixOfComposer;
	
	private SuggestionManager _suggestionsByGenre;

	public ContentBased(String metadataPath, String genreCSVPath, String artistCSVPath, String albumCSVPath,
			String composerCSVPath, String userEventPath) {
		_metadataPath = metadataPath;
		_genreCSVPath = genreCSVPath;
		_artistCSVPath = artistCSVPath;
		_albumCSVPath = albumCSVPath;
		_composerCSVPath = composerCSVPath;
		_userEventPath = userEventPath;
		
//		parseMetadataToGenreCSV(genreCSVPath);
//		parseMetadataToArtistCSV(artistCSVPath);
//		parseMetadataToComposerCSV(composerCSVPath);
//		parseMetadataToAlbumCSV(albumCSVPath);
		
		_mapGenresIDBased = readCSVToKeyBasedHashMap(genreCSVPath);
		_mapArtistsIDBased = readCSVToKeyBasedHashMap(artistCSVPath);
		_mapAlbumsIDBased = readCSVToKeyBasedHashMap(albumCSVPath);
		_mapComposersIDBased = readCSVToKeyBasedHashMap(composerCSVPath);
		
		_mapGenresValueBased = readCSVToValueBasedHashMap(genreCSVPath);
		_mapArtistsValueBased = readCSVToValueBasedHashMap(artistCSVPath);
		_mapAlbumsValueBased = readCSVToValueBasedHashMap(albumCSVPath);
		_mapComposersValueBased = readCSVToValueBasedHashMap(composerCSVPath);
		
		_mapUserEvent = createUserEventMap(userEventPath);

		_tfMatrixOfGenre = createTFMatrix(GENRE, _mapGenresValueBased);
//		_tfMatrixOfArtist = createTFMatrix(ARTIST, _mapArtistsValueBased);
//		_tfMatrixOfAlbum = createTFMatrix(ALBUM, _mapAlbumsValueBased);
//		_tfMatrixOfComposer = createTFMatrix(COMPOSER, _mapComposersValueBased);

		_dfOfGenre = calculateDF(GENRE, _mapGenresValueBased);
//		_dfOfArtist = calculateDF(ARTIST, _mapArtistsValueBased);
//		_dfOfAlbum = calculateDF(ALBUM, _mapAlbumsValueBased);
//		_dfOfComposer = calculateDF(COMPOSER, _mapComposersValueBased);

		_idfOfGenre = calculateIDF(_tfMatrixOfGenre.size(), _dfOfGenre);
//		_idfOfArtist = calculateIDF(_tfMatrixOfArtist.size(), _dfOfArtist);
//		_idfOfAlbum = calculateIDF(_tfMatrixOfAlbum.size(), _dfOfAlbum);
//		_idfOfComposer = calculateIDF(_tfMatrixOfComposer.size(), _dfOfComposer);
		

		_itemMatrixOfGenre = createItemMatrix(_tfMatrixOfGenre, _idfOfGenre);
//		_itemMatrixOfArtist = createItemMatrix(_tfMatrixOfArtist, _idfOfArtist);
//		_itemMatrixOfAlbum = new HashMap<Integer, Double[]>();
//		_itemMatrixOfComposer = new HashMap<Integer, Double[]>();

		_userProfileMatrixOfGenre = createUserProfileOfGenre(_itemMatrixOfGenre);
		
		_suggestionsByGenre = train(_itemMatrixOfGenre, _userProfileMatrixOfGenre, 5);
		_suggestionsByGenre.display();
	}
	
	/**
	 * Parse metadata to specific features
	 */

	public void parseMetadataToGenreCSV(String CSVPath) {
		int genresIndex = 5;
		ArrayList<String> listOfGenres = new ArrayList<String>();

		try {
			CSVReader reader = new CSVReader(new FileReader(_metadataPath));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				String[] genres = nextLine[genresIndex].split(",");
				for (int i = 0; i < genres.length; i++) {
					if (!listOfGenres.contains(genres[i]) && !genres[i].isEmpty()) {
						listOfGenres.add(genres[i]);
					}
				}
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		// Write genres to CSV with format: "index","genre"
		try {
			CSVWriter writer = new CSVWriter(new FileWriter(CSVPath));
			for (int i = 0; i < listOfGenres.size(); i++) {
				String[] genre = { Integer.toString(i), listOfGenres.get(i) };
				writer.writeNext(genre);
			}
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void parseMetadataToArtistCSV(String CSVPath) {
		int artistIndex = 2;
		ArrayList<String> listOfArtist = new ArrayList<String>();

		try {
			CSVReader reader = new CSVReader(new FileReader(_metadataPath));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				String[] artists = nextLine[artistIndex].split(",");
				for (int i = 0; i < artists.length; i++) {
					if (!listOfArtist.contains(artists[i]) && !artists[i].isEmpty()) {
						listOfArtist.add(artists[i]);
					}
				}
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		// Write genres to CSV with format: "index","genre"
		try {
			CSVWriter writer = new CSVWriter(new FileWriter(CSVPath));
			for (int i = 0; i < listOfArtist.size(); i++) {
				String[] artist = { Integer.toString(i), listOfArtist.get(i) };
				writer.writeNext(artist);
			}
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void parseMetadataToComposerCSV(String CSVPath) {
		int composerIndex = 3;
		ArrayList<String> listOfComposer = new ArrayList<String>();

		try {
			CSVReader reader = new CSVReader(new FileReader(_metadataPath));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				String[] composers = nextLine[composerIndex].split(",");
				for (int i = 0; i < composers.length; i++) {
					if (!listOfComposer.contains(composers[i]) && !composers[i].isEmpty()) {
						listOfComposer.add(composers[i]);
					}
				}
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		// Write genres to CSV with format: "index","genre"
		try {
			CSVWriter writer = new CSVWriter(new FileWriter(CSVPath));
			for (int i = 0; i < listOfComposer.size(); i++) {
				String[] composer = { Integer.toString(i), listOfComposer.get(i) };
				writer.writeNext(composer);
			}
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void parseMetadataToAlbumCSV(String CSVPath) {
		int albumIndex = 4;
		ArrayList<String> listOfAlbum = new ArrayList<String>();

		try {
			CSVReader reader = new CSVReader(new FileReader(_metadataPath));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				String[] albums = nextLine[albumIndex].split(",");
				for (int i = 0; i < albums.length; i++) {
					if (!listOfAlbum.contains(albums[i]) && !albums[i].isEmpty()) {
						listOfAlbum.add(albums[i]);
					}
				}
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		// Write genres to CSV with format: "index","genre"
		try {
			CSVWriter writer = new CSVWriter(new FileWriter(CSVPath));
			for (int i = 0; i < listOfAlbum.size(); i++) {
				String[] album = { Integer.toString(i), listOfAlbum.get(i) };
				writer.writeNext(album);
			}
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	public HashMap<Integer, String> readCSVToKeyBasedHashMap(String CSVPath) {
		HashMap<Integer, String> ret = new HashMap<Integer, String>();
		int indexForKey = 0;
		int indexForValue = 1;

		try {
			CSVReader reader = new CSVReader(new FileReader(CSVPath));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				Integer key = Integer.parseInt(nextLine[indexForKey]);
				String value = nextLine[indexForValue];
				ret.put(key, value);
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

	public HashMap<String, Integer> readCSVToValueBasedHashMap(String CSVPath) {
		HashMap<String, Integer> ret = new HashMap<String, Integer>();
		int indexForKey = 0;
		int indexForValue = 1;

		try {
			CSVReader reader = new CSVReader(new FileReader(CSVPath));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				Integer key = Integer.parseInt(nextLine[indexForKey]);
				String value = nextLine[indexForValue];
				ret.put(value, key);
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return ret;
	}

	public Integer[] calculateDF(int featureIndex, HashMap<String, Integer> mapValueBased) {
		Integer[] ret = new Integer[mapValueBased.size()];
		Arrays.fill(ret, new Integer(0));

		try {
			CSVReader reader = new CSVReader(new FileReader(_metadataPath));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				String[] featureItems = nextLine[featureIndex].split(",");				
				for (int i = 0; i < featureItems.length; i++) {
					if (!featureItems[i].isEmpty()) {
						int index = mapValueBased.get(featureItems[i]);
						ret[index]++;				
						
					}
				}
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

	public Double[] calculateIDF(Integer totalOfItems, Integer[] dfOfFeature) {
		System.out.println(totalOfItems);
		Double[] ret = new Double[dfOfFeature.length];
		Arrays.fill(ret, new Double(0));
		for (int i = 0; i < ret.length; i++) {
			ret[i] = Math.log10((double) totalOfItems / dfOfFeature[i]);
		}
		return ret;
	}

	public HashMap<Integer, Double[]> createTFMatrix(int featureIndex, HashMap<String, Integer> mapValueBased) {
		HashMap<Integer, Double[]> ret = new HashMap<Integer, Double[]>();
		int idMusicIndex = 0;

		try {
			CSVReader reader = new CSVReader(new FileReader(_metadataPath));
			String[] nextLine;

			while ((nextLine = reader.readNext()) != null) {
				nextLine[idMusicIndex] = nextLine[idMusicIndex].replaceAll("\\D+", "");
				Integer idMusic = Integer.parseInt(nextLine[idMusicIndex]);
				Double[] vector = new Double[mapValueBased.size()];

				String itemFeatures[] = nextLine[featureIndex].split(",");
				for (int i = 0; i < itemFeatures.length; i++) {					
					if (!itemFeatures[i].isEmpty()) {
						Integer idFeature = mapValueBased.get(itemFeatures[i]);
						vector[idFeature] = 1.0 / Math.sqrt((double) itemFeatures.length);
					}
				}
				ret.put(idMusic, vector);
			}

			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

	public HashMap<Integer, Double[]> createItemMatrix(HashMap<Integer, Double[]> tf, Double[] idf) {
		HashMap<Integer, Double[]> ret = new HashMap<Integer, Double[]>();

		for (Integer id : tf.keySet()) {
			Double[] value = tf.get(id);
			for (int i = 0; i < value.length; i++) {
				if (value[i] != null) {
					value[i] = value[i] * idf[i];
				}
			}
			ret.put(id, value);

		}
		return ret;
	}

	public HashMap<Integer, Double[]> createUserProfileOfGenre(HashMap<Integer, Double[]> itemMatrix) {
		HashMap<Integer, Double[]> ret = new HashMap<Integer, Double[]>();
		int userIdIndex = 0;
		int musicIdIndex = 1;
		int rateIndex = 2;

		try {
			CSVReader reader = new CSVReader(new FileReader(_userEventPath));
			String[] nextLine = null;
			
			while ((nextLine = reader.readNext()) != null) {
				nextLine[userIdIndex] = nextLine[userIdIndex].replaceAll("\\D+", "");
				Integer userID = Integer.parseInt(nextLine[userIdIndex]);
				Integer musicID = Integer.parseInt(nextLine[musicIdIndex]);
				Double rate = Double.parseDouble(nextLine[rateIndex]);				

				Double[] tfOfMusic = itemMatrix.get(musicID);
				if (ret.containsKey(userID)) {
					Double[] currentRateForGenre = ret.get(userID);
					if (rate >= 3.0) {
						for (int i = 0; i < currentRateForGenre.length; i++) {
							if (currentRateForGenre[i] == null) {
								if (tfOfMusic[i] != null) {
									currentRateForGenre[i] = tfOfMusic[i];
								}
							} else {
								if (tfOfMusic[i] != null) {
									currentRateForGenre[i] += tfOfMusic[i];
								}
							}
						}
					} else {
						for (int i = 0; i < currentRateForGenre.length; i++) {
							if (currentRateForGenre[i] == null) {
								if (tfOfMusic[i] != null) {
									currentRateForGenre[i] = -tfOfMusic[i];
								}
							} else {
								if (tfOfMusic[i] != null) {
									currentRateForGenre[i] -= tfOfMusic[i];
								}
							}
						}
					}
				} else {
					ret.put(userID, tfOfMusic);
				}
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

	public SuggestionManager train(HashMap<Integer, Double[]> itemMatrix,
								   HashMap<Integer, Double[]> userProfileMatrix,
								   int numberOfSuggestion) {
		SuggestionManager ret = new SuggestionManager(numberOfSuggestion);

		for (Integer idUserProfile : userProfileMatrix.keySet()) {	
			ArrayList<Integer> songsAlreadyRated = _mapUserEvent.get(idUserProfile);
			for (Integer idMusic : itemMatrix.keySet()) {
				// Check ID Music whether user already rated
				if (songsAlreadyRated.contains(idMusic)) {
					continue;
				}
				
				Double[] itemVector = itemMatrix.get(idMusic);
				Double[] userVector = userProfileMatrix.get(idUserProfile);
				
				Double similarity = cosine(itemVector, userVector);
				
				Suggestion suggestion = new Suggestion(idUserProfile, idMusic, similarity);
				ret.put(suggestion);
			}
		}
		
		return ret;
	}
	
	private Double cosine(Double[] item, Double[] user) {
		Double dotProduct = calculateDotProduct(item, user);
		Double productOfLengths = calculateLengthOfVector(item) * calculateLengthOfVector(user);		
		return dotProduct / productOfLengths;
	}

	private Double calculateDotProduct(Double[] vector1, Double[] vector2) {
		Double ret = new Double(0);
		for (int i = 0; i < vector1.length; i++) {
			if (vector1[i] != null && vector2[i] != null) {
				ret += vector1[i] * vector2[i];
			}			
		}
		return ret;
	}
	
	private Double calculateLengthOfVector(Double[] vector) {
		Double ret = new Double(0);
		
		for (int i = 0; i < vector.length; i++) {
			if (vector[i] != null) {
				ret += vector[i] * vector[i];
			}
		}
		
		return Math.sqrt(ret);
	}

	private HashMap<Integer, ArrayList<Integer>> createUserEventMap(String userEventPath) {
		HashMap<Integer, ArrayList<Integer>> ret = new HashMap<Integer, ArrayList<Integer>>();		
		int userIdIndex = 0;
		int musicIdIndex = 1;

		try {
			CSVReader reader = new CSVReader(new FileReader(userEventPath));
			String[] nextLine = null;
			
			while ((nextLine = reader.readNext()) != null) {
				nextLine[userIdIndex] = nextLine[userIdIndex].replaceAll("\\D+", "");
				Integer userID = Integer.parseInt(nextLine[userIdIndex]);
				Integer musicID = Integer.parseInt(nextLine[musicIdIndex]);		

				if (ret.containsKey(userID)) {
					ArrayList<Integer> songsAlreadyRated = ret.get(userID);
					if (songsAlreadyRated.contains(musicID)) {
						continue;
					}
					else {
						songsAlreadyRated.add(musicID);
					}
					
					ret.put(userID, songsAlreadyRated);					
				}
				else {
					ArrayList<Integer> songsAlreadyRated = new ArrayList<Integer>();
					songsAlreadyRated.add(musicID);
					ret.put(userID, songsAlreadyRated);
				}
				
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return ret;
	}
	
	public SuggestionManager getSuggestionForGenre() {
		return _suggestionsByGenre;
	}
}
