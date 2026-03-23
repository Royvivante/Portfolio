# Bitcoin Sentiment Analysis Project

## Overview
This document outlines the methodology and results of a Bitcoin sentiment analysis project, focusing on the use of natural language processing (NLP) techniques to analyze sentiments from various textual data sources.

## NLP Methodology
We employed several NLP techniques to preprocess and analyze the textual data, including:
- Tokenization
- Stop word removal
- Lemmatization

## TensorFlow LSTM Architecture
The model architecture we implemented is based on Long Short-Term Memory (LSTM) neural networks, leveraging TensorFlow for building and training the model.

### Model Configuration
- Embedding Layer
- LSTM Layer
- Dense Output Layer with Sigmoid Activation

## TF-IDF Baseline
We established a baseline using Term Frequency-Inverse Document Frequency (TF-IDF) to evaluate the effectiveness of our model's output compared to traditional methods.

## Temporal Data Splitting
Data was split temporally to ensure that the model trained on past data was validated against unseen future data, thus simulating a more realistic trading environment.

## Results
- **ROC-AUC Score:** 0.5599

### Statistical Significance Testing
We conducted statistical significance tests to determine if our model's performance was better than random chance, using methods like the McNemar test.

## Key Findings
1. The sentiment prediction model shows promise, with a modest ROC-AUC score indicating some predictive power.
2. Further improvements are necessary to enhance model accuracy.
3. Insights into sentiment trends can be valuable for market predictions.