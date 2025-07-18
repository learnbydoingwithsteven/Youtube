# AI Agents with AutoGen and LM Studio

A comprehensive project demonstrating the creation and implementation of AI agents using Microsoft's AutoGen framework and LM Studio for local model inference, with a focus on stock price analysis.

Video Tutorial: https://youtu.be/Xhg_KKJC6Ok

## 📁 Project Structure
```
├── README.md                                              # Project documentation
├── autogen_test_lmstudio_stock_price.ipynb               # Main testing notebook
├── autogen_test_lmstudio_stock_price.html                # HTML export of main notebook
├── autogen_test_lmstudio_stock_price - yfinance.ipynb    # Enhanced version with yfinance
├── autogen_test_lmstudio_stock_price - yfinance.html     # HTML export of enhanced version
├── autogen_test_officialexample_stockpricechange.ipynb   # Official example implementation
└── autogen_test_officialexample_stockpricechange.html    # HTML export of official example
```

## 🌟 Overview
This project demonstrates:
- 🤖 Creation of AI agents using AutoGen
- 🏠 Local model inference with LM Studio
- 📈 Stock price analysis and visualization
- 🔄 Multi-agent conversation flows
- 📊 Financial data processing
- 🎯 Agent collaboration strategies

## ✨ Features
- 🔍 Multi-agent system architecture
- 📝 Stock price data retrieval and analysis
- 🎯 Financial analysis capabilities
- 📊 Data visualization and reporting
- 🤝 Agent collaboration patterns
- 🔄 Error handling and recovery
- 🎨 Interactive visualizations
- 📈 Performance monitoring

## 🛠️ Prerequisites
- Python 3.8+
- Required packages:
  ```bash
  pip install ag2
  pip install yfinance
  pip install pandas numpy
  pip install matplotlib seaborn
  pip install jupyter
  pip install python-dotenv
  pip install requests
  ```
- LM Studio (for local model inference)
- Basic understanding of:
  - Python programming
  - AutoGen framework
  - Financial markets
  - API integration
  - Local LLM deployment

## 📦 Installation
1. Clone the repository:
```bash
git clone https://github.com/learnbydoingwithsteven/Youtube.git
cd "20240429_AI_Agents_Autogen_LMStudio"
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up LM Studio:
   - Download and install LM Studio
   - Load your preferred local model
   - Configure API endpoints
   - Set environment variables

## 💻 Usage
1. Start LM Studio and launch your local model
2. Configure your environment:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```
3. Run the notebooks:
   - Basic implementation: `autogen_test_lmstudio_stock_price.ipynb`
   - Enhanced version: `autogen_test_lmstudio_stock_price - yfinance.ipynb`
   - Official example: `autogen_test_officialexample_stockpricechange.ipynb`

## 🔍 Technical Details
The project implements:
1. Agent Configuration:
   - Assistant agent for analysis
   - User proxy for interactions
   - Code execution agent
   - Group chat management

2. Stock Analysis:
   - Price data retrieval
   - Technical analysis
   - Data visualization
   - Result interpretation
   - Trend analysis

3. LM Studio Integration:
   - Local model setup
   - API configuration
   - Response handling
   - Error management
   - Performance optimization

4. Multi-Agent Collaboration:
   - Task distribution
   - Knowledge sharing
   - Error recovery
   - Result aggregation

## ⚠️ Best Practices
- Configure API endpoints properly
- Monitor model resource usage
- Handle API rate limits
- Implement error handling
- Document agent interactions
- Version control code
- Cache model responses
- Validate data inputs

## 🔧 Troubleshooting
Common solutions:
- Check LM Studio connection
- Verify API endpoints
- Monitor memory usage
- Review error logs
- Check data formats
- Validate model responses
- Debug agent communication
- Handle timeouts

## 🤝 Contributing
We welcome contributions in:
- Agent implementations
- Analysis methods
- Documentation
- Error handling
- Performance optimization
- Testing scenarios
- UI improvements

## 📜 License
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

Copyright 2024 Learn By Doing With Steven (YouTube Channel)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## 🙏 Acknowledgments
- Microsoft AutoGen team
- LM Studio developers
- Financial data providers
- Open-source contributors
- Learn By Doing With Steven community
- Python visualization community
- AI research community

## 📌 Important Notes
- API configuration
- Model selection
- Resource management
- Rate limiting
- Data accuracy
- Agent behavior
- Security considerations
- Performance implications
- Educational purpose
- Model limitations
