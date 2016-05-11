schema = {
    "type": "object",
    "$schema": "http://json-schema.org/draft-04/schema",
    "additionalProperties": False,
    "properties": {
        "text": {
            "type": "object",
            "additionalProperties": False,
            "patternProperties": {
                "^T[0-9]+$": {
                    "type": "object",
                    "required": ["rectangle", "category", "refersTo", "id", "parentObject",
                                 "replacementText"],
                    "additionalProperties": False,
                    "properties": {
                        "box_id": {
                            "type": "String"
                        },
                        "category": {
                                "enum": ["header/topic", "definition", "discussion", "question", "question", "diagram", "unlabeled"]
                            },
                        "contents": {
                            "type": "string"
                        },
                        "score": {
                          "type": "number"
                        },
                        "rectangle": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "type": "array",
                                "minItems": 2,
                                "maxItems": 2,
                                "items": {
                                    "type": "integer",
                                },
                            },
                        },
                        "source": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "$schema": "http://json-schema.org/draft-04/schema#",
                                "title": "C Object",

                                "type": "object",
                                "required": ["id", "name"],

                                "properties": {
                                    "book_source": {
                                        "type": "string"
                                    },
                                    "page_n": {
                                        "type": "int"
                                    }
                                },
                                "additionalProperties": False
                            }
                        }
                    }
                }
            }
        },
        "figure": {
            "type": "object",
            "additionalProperties": False
        },
        "linkage": {
            "type": "object",
            "additionalProperties": False
        }
    }
}

