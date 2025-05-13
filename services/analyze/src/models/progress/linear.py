def recommend_linear_progress(value: int | float, occurences: int, config):
    if "target" not in config:
        return value

    if (
        "maxOccurences" in config
        and "interval" in config
        and config["maxOccurences"] < occurences * config["interval"]
    ):
        return value

    target = config["target"]

    result = value[target] + config["difference"] * (
        occurences % config["interval"] == 0
    )

    if "maxValue" in config:
        result = min(result, config["maxValue"])

    value[target] = result

    return value
