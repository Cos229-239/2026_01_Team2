import pytest
from app import app

# Test will verify the integrity of the Flask API endpoint
# Ensures grid generation logic will remain consistent during any future dev

@pytest.fixture
def client():
    #This->allows for  simulated browser requests 
    #without running live server during testing
    """Setup temporary test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

#========================================================
# TEST 1: Connectivity Verification
#========================================================
def test_home_route(client):
    """Verify home route is online."""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Team 2 Flask Server is Running!" in response.data

#========================================================
# TEST 2: Standard Grid Initialization and Logic <20x20> 
# Confirming math for grid requirements are correct
#========================================================

def test_grid_initialization_standard(client):
    """Verify 2d grid structure for standard size."""
    response = client.get('/api/game/init?game_type=standard')
    data = response.get_json()

    # Data integrity Assertions
    assert response.status_code == 200
    assert data['selected_game'] == 'standard'
    # 2d Array:
    # Top level = 20 rows
    assert len(data['grid']) == 20
    # 20 cols per row
    assert len(data['grid'][0]) == 20
    assert data["status"] == 'ready'

#========================================================
# TEST 3: Mini Grid Logic
# Confirming trigger for non standard grid is correct <5x5>
# In Place for potential dynamic grid sizing
#========================================================
def test_grid_initialization_mini(client):
    """Verify 2d grid structure for mini size."""
    response = client.get('/api/game/init?game_type=mini')
    data = response.get_json()

    # Scaling Logic Assertions
    assert response.status_code == 200
    assert len(data['grid']) == 5
    assert len(data['grid'][0]) == 5

#========================================================
# TEST 4: Error Handling
#========================================================
def test_invalid_game_type(client):
    """Ensure backend returns a 400 error for unknown types."""
    response = client.get('/api/game/init?game_type=unknown_game')
    # Error handling assertions
    assert response.status_code == 400
    assert b"error" in response.data