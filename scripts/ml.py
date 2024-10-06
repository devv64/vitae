import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Modified dataset with an additional 'stress' column
data = {
    'task_duration': [30, 45, 60, 120, 90],
    'task_intensity': [5, 3, 7, 9, 2],
    'historical_completion_time': [35, 50, 75, 140, 95],
    'stress': [60, 30, 75, 90, 25]  # Stress levels between 0-100
}

df = pd.DataFrame(data)
df['extra_time'] = df['historical_completion_time'] - df['task_duration']
X = df[['task_duration', 'task_intensity', 'stress']]
y = df['extra_time']

# Split the data: 80% for training, 20% for testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
# Initialize and fit the linear regression model
model = LinearRegression()
model.fit(X_train, y_train)
# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
print(f'Mean Squared Error: {mse}')
new_task = [[40, 6, 70]]  # New task: 40 minutes duration, intensity 6, stress level 70
predicted_extra_time = model.predict(new_task)
print(f'Predicted Extra Time: {predicted_extra_time[0]} minutes')


