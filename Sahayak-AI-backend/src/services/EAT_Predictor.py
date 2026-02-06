#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import random


# In[2]:


df = pd.read_csv("eta_synthetic_dataset.csv")


# In[3]:


df.shape


# In[4]:


X = df.drop("Processing_Time", axis=1)
y = df["Processing_Time"]


# In[5]:


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# In[6]:


model = RandomForestRegressor(
    n_estimators=200,
    max_depth=10,
    random_state=42
)
model.fit(X_train, y_train)


# In[7]:


y_pred = model.predict(X_test)


# In[8]:


mae = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)


# In[9]:


print(f"Mean Absolute Error (MAE): {mae:.2f} hours")
print(f"R² Score: {r2:.2f}")


# In[10]:


importances = model.feature_importances_
plt.figure(figsize=(8, 5))
plt.barh(X.columns, importances, color='teal')
plt.title("Feature Importance in Turnaround Time Prediction")
plt.xlabel("Importance Score")
plt.tight_layout()
plt.show()


# In[11]:


sample = X_test.iloc[0:1]
predicted_time = model.predict(sample)[0]
print("\nSample prediction:")
print(sample)
print(f"Predicted Processing Time: {predicted_time:.2f} hours")


# In[12]:


joblib.dump(model, "EAT_predictor.pkl")


# In[ ]:


def predict_eta_prototype():
    """
    Prototype function that returns a random ETA (Processing Time)
    for demonstration purposes. No input required.
    """

    # Range chosen to match typical synthetic dataset values
    min_eta = 10   # minimum hours
    max_eta = 70   # maximum hours

    # Generate random ETA
    predicted_eta = round(random.uniform(min_eta, max_eta), 2)

    print(f"Predicted ETA (Prototype): {predicted_eta} hours")
    return predicted_eta

