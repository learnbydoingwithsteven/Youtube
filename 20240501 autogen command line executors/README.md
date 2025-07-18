# AutoGen Command Line Code Executor Demo

This project demonstrates the implementation and usage of AutoGen's Command Line Code Executor functionality, showcasing how to execute Python code programmatically using AutoGen's powerful automation capabilities. Watch the full tutorial on [Learn By Doing with Steven YouTube Channel](https://www.youtube.com/).

## Project Overview

The project illustrates:
1. Basic command line code execution
2. Integration with AutoGen agents
3. Automated code generation and execution
4. Interactive coding demonstrations

## Project Structure

### Files
- `20240430 Command Line Code Executor.ipynb`: Main Jupyter notebook containing the implementation and examples
- `README.md`: Project documentation

## Features

### Basic Code Execution 🔧
- Local command line code execution setup
- Temporary directory management
- Code block execution with output capture
- Error handling and execution status reporting

### Agent Integration 🤖
- ConversableAgent implementation
- Code execution configuration
- Agent-based code generation
- Interactive chat capabilities

### Example Applications 📊
- Fibonacci number calculation
- Basic Python script execution
- Output capture and display
- Temporary file management

## Technical Implementation

### Prerequisites
- Python 3.8+
- Required packages:
  ```bash
  pip install ag2
  ```

### Core Components
1. **LocalCommandLineCodeExecutor** 🛠️
   - Manages code execution environment
   - Handles file I/O operations
   - Provides execution status and output

2. **ConversableAgent** 💬
   - Facilitates code generation
   - Manages execution flow
   - Handles user interactions

### Code Examples

#### Basic Execution
```python
from pathlib import Path
from autogen.coding import CodeBlock, LocalCommandLineCodeExecutor

work_dir = Path("coding")
executor = LocalCommandLineCodeExecutor(work_dir=work_dir)
```

#### Agent Setup
```python
from autogen import ConversableAgent

code_executor_agent = ConversableAgent(
    "code_executor_agent",
    llm_config=False,
    code_execution_config={"executor": executor},
    human_input_mode="ALWAYS"
)
```

## Usage Guide

1. Clone the repository
2. Install required dependencies:
   ```bash
   pip install ag2
   ```
3. Open the Jupyter notebook
4. Follow the examples and run the demonstrations

## Security Best Practices 🔒
- Code execution in isolated environments
- Temporary directories for file operations
- Human verification option for code execution
- Timeout settings for execution control
- Regular security updates
- Input validation and sanitization

## Contributing
We welcome contributions:
- Bug reports and fixes
- Feature suggestions
- Documentation improvements
- Example additions
- Best practices sharing

## License
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

## Acknowledgments
- AutoGen development team
- Python community
- All contributors and users
