from db_utils.db_utils import DBUtils


if __name__ == '__main__':
    db_connector = DBUtils()
    db_connector.import_metadata()
