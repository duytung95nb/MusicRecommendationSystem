package contentbased;

public class Suggestion {
	private Integer _idUser;
	private Integer _idMusic;
	private Double	_prediction;
	
	public Suggestion(Integer idUser, Integer idMusic, Double prediction) {
		_idUser = idUser;
		_idMusic = idMusic;
		_prediction = prediction;		
	}
	
	public Integer getIDUser() {
		return _idUser;
	}

	public void setIDUser(Integer _idUser) {
		this._idUser = _idUser;
	}

	public Integer getIDMusic() {
		return _idMusic;
	}

	public void setIDMusic(Integer _idMusic) {
		this._idMusic = _idMusic;
	}

	public Double getPrediction() {
		return _prediction;
	}

	public void setPrediction(Double _prediction) {
		this._prediction = _prediction;
	}
	
}
