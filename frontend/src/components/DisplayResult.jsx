import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';


const DisplayResult = ({ recognizedTextData }) => {
    const [recognizedText, setRecognizedText] = useState('');
    const [inputText, setInputText] = useState('');
    const [meanings, setMeanings] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default to English
    // const [processedText, setProcessedText] = useState('');

    // Function to fetch meanings from the backend
    const fetchMeanings = useCallback(async (text) => {
        // if (typeof text !== 'string') {
        //     console.error('Invalid text type:', typeof text);
        //     return;
        // }
        try {
            const response = await axios.get(`http://localhost:7000/dictionary/meaning/${text.toLowerCase()}?language=${selectedLanguage}`);
            // console.log(response.data);
            setMeanings(response.data.meanings);
        } catch (error) {
            console.error('Error fetching meanings:', error);
        }
    }, [selectedLanguage]);

    // Function to recognize text from the image using tesseract.js
    // const recognizeText = async (image) => {
    //     try {
    //         const { data: { text } } = await Tesseract.recognize(image, 'eng', {
    //             logger: (m) => m, // Log progress
    //         });
    //         return text;
    //     } catch (error) {
    //         console.error('Error recognizing text:', error);
    //         throw error;
    //     }
    // };

    // Function to process recognized text with OpenAI
    // const processTextWithOpenAI = async (text) => {
    //     const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // Replace with your OpenAI API key
    //     try {
    //         const response = await axios.post(
    //             'https://api.openai.com/v1/engines/davinci-codex/completions',
    //             {
    //                 prompt: Please summarize the following text: ${text},
    //                 max_tokens: 100,
    //                 n: 1,
    //                 stop: null,
    //                 temperature: 0.5,
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': Bearer ${apiKey},
    //                 },
    //             }
    //         );
    //         setProcessedText(response.data.choices[0].text.trim());
    //     } catch (error) {
    //         console.error('Error processing text with OpenAI:', error);
    //         setProcessedText('An error occurred while processing the text with OpenAI.');
    //     }
    // };

    useEffect(() => {
        if (recognizedTextData) {
            setRecognizedText(recognizedTextData);
            fetchMeanings(recognizedTextData);
        }
    }, [recognizedTextData, fetchMeanings]);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };



    const handleFormSubmit = (e) => {
        e.preventDefault();
        setRecognizedText(inputText);
        fetchMeanings(inputText);
        // processTextWithOpenAI(inputText); // Process input text with OpenAI
    };

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
        if (recognizedText) {
            fetchMeanings(recognizedText);
        } else if (inputText) {
            fetchMeanings(inputText);
        }
    };

    return (
        <div>
            {/* Display Recognized Text */}
            <Row className="mt-3">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Recognized Text</Card.Title>
                            <Card.Text>{recognizedTextData}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Form onSubmit={handleFormSubmit} className="mt-3 mt-md-0">
                        <Form.Group controlId="formInputText">
                            <Form.Control
                                type="text"
                                value={inputText}
                                onChange={handleInputChange}
                                placeholder="Enter a word"
                            />
                        </Form.Group>
                        {/* Language Selection */}
                        <Form.Group controlId="formLanguageSelect" className="mt-3 col-md-3" style={{ marginLeft: '40%' }}>
                            <Form.Label>Select Language:</Form.Label>
                            <Form.Control as="select" value={selectedLanguage} onChange={handleLanguageChange}>
                                <option value="English">English</option>
                                <option value="Telugu">Telugu</option>
                                <option value="Hindi">Hindi</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-2">
                            Get Meaning
                        </Button>
                    </Form>
                </Col>
            </Row>

            {/* Display Meanings */}
            <Card className="mt-3 mb-3 col-md-6" style={{ marginLeft: '25%' }}>
                <Card.Body>
                    <Card.Title className="mt-3">Meanings</Card.Title>
                    {meanings.length > 0 ? (
                        meanings.map((meaning, index) => (
                            <p key={index}>{meaning}</p>
                        ))
                    ) : (
                        <Card.Text>No meanings found.</Card.Text>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default DisplayResult;