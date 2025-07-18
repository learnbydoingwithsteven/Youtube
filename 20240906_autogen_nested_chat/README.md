# AutoGen Nested Chat Implementation

This project demonstrates advanced nested chat implementations using Microsoft's AutoGen framework. Watch the tutorial on [Learn By Doing with Steven YouTube Channel](https://youtu.be/eEwkQTaRCDs).

## 📁 Project Structure
```
├── README.md    # Project documentation
├── agents.py    # Agent definitions and configurations
├── app.py       # Main application entry point
├── config.py    # Configuration settings
└── workflow.py  # Workflow and conversation logic
```

## 🌟 Overview
This project showcases:
- 🤝 Implementation of nested conversations between multiple AI agents
- 🧩 Complex problem-solving through agent collaboration
- 📋 Dynamic task delegation and management
- 🚀 Advanced AutoGen framework features

## ✨ Features
- 🤖 Multiple AI agent interactions
- 🔄 Nested conversation flows
- 📝 Task breakdown and delegation
- 🎯 Goal-oriented problem solving
- 🔍 Context awareness between agents
- 📊 Structured conversation management

## 🎭 Key Components
1. Agent Types:
   - 👨‍💼 Assistant Agent: Primary problem solver
   - 👨‍💻 Code Expert: Handles code-related tasks
   - 📋 Planner: Manages task breakdown
   - 👀 Reviewer: Validates solutions
   
2. Conversation Patterns:
   - 📝 Sequential discussions
   - 🔄 Nested problem-solving
   - ⚡ Parallel agent interactions
   - 🧠 Context preservation

## 🛠️ Prerequisites
- Python 3.8+
- Required packages:
  ```bash
  pip install ag2 openai
  ```
- OpenAI API key or compatible LLM setup

## 📦 Installation
1. Clone the repository:
```bash
git clone https://github.com/learnbydoingwithsteven/Youtube.git
cd "20240906_autogen_nested_chat"
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure settings:
- Set up your API keys in `config.py`
- Adjust agent parameters as needed

## 💻 Usage
1. Start the application:
```bash
python app.py
```

2. Run specific workflows:
```bash
python workflow.py
```

## ⚙️ Configuration
- 🔑 API keys and endpoints in `config.py`
- 🤖 Agent settings in `agents.py`
- 🔄 Workflow patterns in `workflow.py`
- 📊 Logging and monitoring options

## 🔍 Technical Details
The project leverages:
- Microsoft AutoGen framework
- Advanced agent architectures
- Nested conversation patterns
- Dynamic context management

## ⚠️ Best Practices
- Define clear agent roles
- Structure conversations properly
- Handle context effectively
- Implement proper error handling
- Monitor agent interactions

## 🔧 Troubleshooting
Common solutions:
- Check API authentication
- Verify agent configurations
- Monitor memory usage
- Review conversation logs

## 🤝 Contributing
We welcome contributions in:
- Bug fixes
- Feature additions
- Documentation improvements
- Performance optimizations
- Testing enhancements

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
- OpenAI API developers
- Open-source community
- All contributors and users

## 📌 Important Notes
- Keep API keys secure
- Monitor API usage
- Update dependencies regularly
- Follow security best practices
- Back up your configurations
