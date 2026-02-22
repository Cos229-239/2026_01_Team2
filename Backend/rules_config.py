# This is set the "brush brush based rules" logic
# Dimensions of the bush (eg. 1x1, 2x2, and 3x3) sets the rule
# Key words can be changed as the project grows              Default = "empty"
#THIS------> allows scalability. Making any asset added in the future automatically follows these rules

GAME_RULES = {
    # Default rule
    "1x1":{
        "rule_type": "NONE",
        "target-keywords": [],
        "error_messaage": ""
    },
    "2X2":{
        # Example Rule: 2x2 assets might be considered heavy and shouldn't be placed near not strong enough to support
        "rule_type": "REQUIRES_ADJACENT",
        "target-keywords": ["empty"],
        "error_messaage": "2X2 placement requires adjancency to an existing grid."
    },
    "3X3":{
        "rule_type": "REQUIRES_ADJACENT",
        "target-keywords": ["empty"],
        "error_messaage": "3X3 placement cannot be adjacent to this tile type."
    }
}