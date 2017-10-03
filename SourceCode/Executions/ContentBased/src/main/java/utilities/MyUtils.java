package utilities;

import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import au.com.bytecode.opencsv.CSVReader;
import au.com.bytecode.opencsv.CSVWriter;

public class MyUtils {
	public static void ParseMetadataToGenreCSV(String metadataPath, String destinationPath) {
		int genresIndex = 5;
		ArrayList<String> listOfGenres = new ArrayList<String>();
		
		try {
			CSVReader reader = new CSVReader(new FileReader(metadataPath));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				String[] genres = nextLine[genresIndex].split(",");
				for (int i = 0; i < genres.length; i++) {
					if (!listOfGenres.contains(genres[i])) {
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
			CSVWriter writer = new CSVWriter(new FileWriter(destinationPath));
			for (int i = 0; i < listOfGenres.size(); i++) {
				String[] genre = { Integer.toString(i), listOfGenres.get(i) };
				writer.writeNext(genre);
			}
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static HashMap<Integer, String> ReadGenresCSVToIDBasedHashMap(String path) {
		HashMap<Integer, String> ret = new HashMap<Integer, String>();
		int indexForIDGenre = 0;
		int indexForGenre = 1;

		try {
			CSVReader reader = new CSVReader(new FileReader(path));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				Integer idGenre = Integer.parseInt(nextLine[indexForIDGenre]);
				String genre = nextLine[indexForGenre];
				ret.put(idGenre, genre);
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

	public static HashMap<String, Integer> ReadGenresCSVToGenreBasedHashMap(String path) {
		HashMap<String, Integer> ret = new HashMap<String, Integer>();
		int indexForIDGenre = 0;
		int indexForGenre = 1;

		try {
			CSVReader reader = new CSVReader(new FileReader(path));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				Integer idGenre = Integer.parseInt(nextLine[indexForIDGenre]);
				String genre = nextLine[indexForGenre];
				ret.put(genre, idGenre);
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

	public static Integer[] CalculateDFForGenre(String path, HashMap<String, Integer> mapGenresGenreBased) {
		int genreIndex = 5;
		Integer[] ret = new Integer[mapGenresGenreBased.size()];
		Arrays.fill(ret, new Integer(0));

		try {
			CSVReader reader = new CSVReader(new FileReader(path));
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				String[] genres = nextLine[genreIndex].split(",");
				for (int i = 0; i < genres.length; i++) {
					int index = mapGenresGenreBased.get(genres[i]);
					ret[index]++;
				}
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;

	}

	public static Double[] CalculateIDFForGenre(Integer[] DFForGenre, Integer totalOfMusics) {
		Double[] ret = new Double[DFForGenre.length];
		Arrays.fill(ret, new Double(0));
		for (int i = 0; i < ret.length; i++) {
			ret[i] = Math.log10((double) totalOfMusics / DFForGenre[i]);
		}
		return ret;
	}

	public static HashMap<Integer, Double[]> TFMaxtrixForGenre(String path,
			HashMap<String, Integer> mapGenresGenreBased) {
		HashMap<Integer, Double[]> ret = new HashMap<Integer, Double[]>();
		int idMusicIndex = 0;
		int genresIndex = 5;

		try {
			CSVReader reader = new CSVReader(new FileReader(path));
			String[] nextLine;

			while ((nextLine = reader.readNext()) != null) {
				nextLine[idMusicIndex] = nextLine[idMusicIndex].replaceAll("\\D+", "");
				Integer idMusic = Integer.parseInt(nextLine[idMusicIndex]);
				Double[] vector = new Double[mapGenresGenreBased.size()];

				String genres[] = nextLine[genresIndex].split(",");
				for (int i = 0; i < genres.length; i++) {
					Integer idGenre = mapGenresGenreBased.get(genres[i]);
					vector[idGenre] = 1.0 / Math.sqrt((double) genres.length);
				}
				ret.put(idMusic, vector);
			}

			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

	public static HashMap<Integer, Double[]> MakeUserProfileForGenre(String path,
			HashMap<Integer, Double[]> TFMatrixForGenre) {
		HashMap<Integer, Double[]> ret = new HashMap<Integer, Double[]>();
		int userIdIndex = 0;
		int musicIdIndex = 1;
		int rateIndex = 2;

		try {
			CSVReader reader = new CSVReader(new FileReader(path));
			String[] nextLine;

			while ((nextLine = reader.readNext()) != null) {
				nextLine[userIdIndex] = nextLine[userIdIndex].replaceAll("\\D+", "");
				Integer userID = Integer.parseInt(nextLine[userIdIndex]);
				Integer musicID = Integer.parseInt(nextLine[musicIdIndex]);
				Double rate = Double.parseDouble(nextLine[rateIndex]);

				Double[] tfOfMusic = TFMatrixForGenre.get(musicID);
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
}
