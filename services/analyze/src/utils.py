from src.config import CACHED_MODEL_FULL_PATH
from collections import defaultdict
import pathlib
import pickle
import os


#### PRIVATE ####
def _get_cache_filename(name: str) -> str:
    return f"{name}.model"


def _get_full_cache_path(name: str) -> str:
    filename = _get_cache_filename(name)
    return os.path.join(CACHED_MODEL_FULL_PATH, filename)


### GENERAL UTILS ###
def _save(model: any, path: str):
    with open(path, "wb") as file:
        pickle.dump(model, file)


def _load(path):
    result = None
    with open(path, "rb") as file:
        result = pickle.load(file)

    return result


def _does_file_exists(path: str):
    file = pathlib.Path(path)
    return file.exists()


def dict_to_defaultdict(dictionary: dict, func: lambda: 0):
    return defaultdict(func, dictionary)


def defaultdict_to_dict(dictionary: defaultdict):
    return dict(dictionary)


#### PUBLIC ####
def does_cache_exists(name: str):
    return _does_file_exists(_get_full_cache_path(name))


def save_model(model: any, name: str) -> None:
    if type(model) == defaultdict:
        model = defaultdict_to_dict(model)

    _save(model, _get_full_cache_path(name))


def load_model(name: str, func=None) -> any:

    model = _load(_get_full_cache_path(name))

    if type(model) == dict:
        model = dict_to_defaultdict(model, func)

    return model
