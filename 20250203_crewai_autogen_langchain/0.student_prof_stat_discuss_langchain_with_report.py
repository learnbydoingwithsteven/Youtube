# 0.student_prof_stat_discuss_langchain_with_report.py
import os
import sys
from langchain_community.chat_models import ChatOllama
from langchain.prompts import MessagesPlaceholder, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from langchain.schema import SystemMessage, HumanMessage
from datetime import datetime
from pathlib import Path
import numpy as np
import pandas as pd
from dataclasses import dataclass

# Configure environment
os.environ['OPENAI_API_BASE'] = 'http://localhost:11434'
os.environ['OPENAI_API_KEY'] = ''

# Set console to UTF-8 mode for emoji support
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)

@dataclass
class DiscussionMessage:
    role: str
    content: str
    timestamp: str
    topic: str

class StatisticsDiscussionReport:
    def __init__(self, topic: str):
        self.topic = topic
        self.messages = []
        self.data = {}
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
    def add_message(self, role: str, content: str, topic: str):
        """Add a message to the discussion history"""
        message = DiscussionMessage(
            role=role,
            content=content,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            topic=topic
        )
        self.messages.append(message)
    
    def set_data(self, data: dict):
        """Set statistical data"""
        self.data = data
    
    def _generate_html_data(self) -> str:
        """Generate HTML for statistical data section"""
        if not self.data:
            return "<p>No statistical data available</p>"
        
        html = "<div class='statistical-data'>"
        html += "<h2>Statistical Data</h2>"
        
        for category, data in self.data.items():
            html += f"<h3>{category.replace('_', ' ').title()}</h3>"
            if isinstance(data, pd.DataFrame):
                html += data.to_html(classes='data-table', border=1)
            elif isinstance(data, pd.Series):
                html += pd.DataFrame(data).to_html(classes='data-table', border=1)
            else:
                html += "<table class='data-table'>"
                if isinstance(data, dict):
                    for key, value in data.items():
                        html += f"<tr><td>{key.replace('_', ' ').title()}</td><td>{value}</td></tr>"
                else:
                    html += f"<tr><td>{data}</td></tr>"
                html += "</table>"
        
        html += "</div>"
        return html
    
    def _generate_html_discussion(self) -> str:
        """Generate HTML for discussion messages"""
        if not self.messages:
            return "<p>No discussion messages available</p>"
        
        html = "<div class='discussion'>"
        current_topic = ""
        
        for msg in self.messages:
            if msg.topic != current_topic:
                if current_topic:
                    html += "</div>"
                current_topic = msg.topic
                html += f"<div class='discussion-section'><h2>{current_topic}</h2>"
            
            html += f"<div class='message {msg.role}'>"
            html += f"<div class='speaker-label'>{msg.role.title()}</div>"
            html += f"<p class='timestamp'>{msg.timestamp}</p>"
            html += f"<div class='content'>{msg.content}</div>"
            html += "</div>"
        
        if current_topic:
            html += "</div>"
        html += "</div>"
        return html
    
    def generate_report(self) -> str:
        """Generate complete HTML report"""
        css = """
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .statistical-data { margin-bottom: 30px; }
            .data-table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            .data-table td, .data-table th { 
                padding: 8px; 
                border: 1px solid #ddd; 
                text-align: left; 
            }
            .data-table tr:nth-child(even) { background-color: #f9f9f9; }
            .data-table th { background-color: #4CAF50; color: white; }
            .discussion-section { 
                margin: 20px 0; 
                padding: 20px; 
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .message { 
                margin: 10px 0; 
                padding: 15px;
                border-radius: 5px;
                position: relative;
            }
            .message.student { 
                background-color: #e3f2fd;
                border-left: 4px solid #2196F3;
            }
            .message.professor { 
                background-color: #f5f5f5;
                border-left: 4px solid #4CAF50;
            }
            .message.system {
                background-color: #fff3e0;
                border-left: 4px solid #ff9800;
            }
            .speaker-label {
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
                font-size: 1.1em;
            }
            .student .speaker-label { color: #2196F3; }
            .professor .speaker-label { color: #4CAF50; }
            .system .speaker-label { color: #ff9800; }
            .timestamp { 
                color: #666; 
                font-size: 0.9em; 
                margin: 0;
                font-style: italic;
            }
            .content { 
                margin-top: 10px; 
                white-space: pre-wrap; 
            }
            h1, h2, h3 { color: #333; }
            .formula {
                font-family: "Courier New", monospace;
                background-color: #f8f9fa;
                padding: 2px 5px;
                border-radius: 3px;
            }
        </style>
        """
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Statistics Discussion Report - {self.topic}</title>
            {css}
        </head>
        <body>
            <h1>Statistics Discussion Report - {self.topic}</h1>
            <p>Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
            {self._generate_html_data()}
            {self._generate_html_discussion()}
        </body>
        </html>
        """
        return html
    
    def save_report(self):
        """Save the report to a file"""
        report_dir = Path("reports")
        report_dir.mkdir(exist_ok=True)
        
        filename = f"0.student_prof_stat_discuss_langchain_with_report_{self.timestamp}.html"
        filepath = report_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(self.generate_report())
        
        return filepath

def generate_sample_data(n_samples=100):
    """Generate sample statistical data"""
    np.random.seed(42)
    
    # Generate student scores
    scores = np.random.normal(75, 15, n_samples)
    scores = np.clip(scores, 0, 100)  # Ensure scores are between 0 and 100
    
    # Create a DataFrame
    df = pd.DataFrame({
        'Student_ID': range(1, n_samples + 1),
        'Score': scores.round(2)
    })
    
    # Calculate statistics
    stats = {
        'descriptive_stats': df['Score'].describe(),
        'distribution_info': {
            'skewness': df['Score'].skew().round(3),
            'kurtosis': df['Score'].kurtosis().round(3)
        }
    }
    
    return stats

def format_message(content, indent=2):
    """Format message with proper word wrap and indentation"""
    wrapped_lines = []
    for line in content.split('\n'):
        while len(line) > 70:
            split_point = line[:70].rfind(' ')
            if split_point == -1:
                split_point = 70
            wrapped_lines.append(line[:split_point])
            line = line[split_point:].lstrip()
        wrapped_lines.append(line)
    return '\n'.join(' ' * indent + line for line in wrapped_lines)

# Initialize LangChain components
llm = ChatOllama(
    model="llama3.2:1b",
    temperature=0.7,
    base_url="http://localhost:11434"
)

# Create conversation memories
def create_memory():
    return ConversationBufferWindowMemory(
        k=5,
        return_messages=True,
        memory_key="history",
        input_key="input",
        output_key="output"
    )

# Define agent prompts
def create_prompt(system_content):
    return ChatPromptTemplate.from_messages([
        SystemMessage(content=system_content),
        MessagesPlaceholder(variable_name="history"),
        HumanMessagePromptTemplate.from_template("{input}")
    ])

student_prompt = create_prompt("""You are a curious and engaged statistics student.
Your role is to ask insightful questions about statistical concepts and data analysis.
Focus on understanding fundamental concepts and their practical applications.
Express your thoughts clearly and show eagerness to learn.""")

professor_prompt = create_prompt("""You are an experienced statistics professor.
Your role is to explain statistical concepts clearly and provide helpful examples.
Use analogies when appropriate and break down complex ideas into digestible parts.
Be patient, encouraging, and thorough in your explanations.""")

# Create conversation chains
def create_chain(prompt):
    return prompt | llm

student_chain = create_chain(student_prompt)
professor_chain = create_chain(professor_prompt)

# Create memories for each participant
student_memory = create_memory()
professor_memory = create_memory()

def get_chain_response(chain, memory, input_text):
    """Get response from a chain with memory management"""
    # Get chat history
    chat_history = memory.load_memory_variables({})
    
    # Prepare input
    chain_input = {
        "input": input_text,
        "history": chat_history.get("history", [])
    }
    
    # Get response
    result = chain.invoke(chain_input)
    
    # Save to memory
    memory.save_context(
        {"input": input_text},
        {"output": result.content if hasattr(result, 'content') else str(result)}
    )
    
    return result.content if hasattr(result, 'content') else str(result)

def conduct_discussion_round(topic: str, data: dict, student_chain, student_memory, 
                           professor_chain, professor_memory, report):
    """Conduct a single round of student-professor discussion"""
    try:
        # Student asks question
        student_input = f"Given this statistical data: {data}, what questions do you have about {topic}?"
        student_question = get_chain_response(student_chain, student_memory, student_input)
        
        print("\n👨‍🎓 Student:")
        print("-" * 40)
        print(format_message(student_question))
        report.add_message("student", student_question, topic)
        
        # Professor responds
        professor_input = f"Please explain this concept, addressing the student's question: {student_question}"
        professor_response = get_chain_response(professor_chain, professor_memory, professor_input)
        
        print("\n👨‍🏫 Professor:")
        print("-" * 40)
        print(format_message(professor_response))
        report.add_message("professor", professor_response, topic)
        
        return {"question": student_question, "response": professor_response}
    except Exception as e:
        error_msg = f"Error in discussion: {str(e)}"
        print(f"❌ {error_msg}")
        report.add_message("system", error_msg, topic)
        return {"error": str(e)}

if __name__ == "__main__":
    # Initialize the discussion
    topics = [
        "Descriptive Statistics",
        "Normal Distribution",
        "Statistical Significance"
    ]
    
    print("\n" + "=" * 80)
    print("🎓 Starting Statistics Discussion".center(80))
    print("=" * 80)
    
    # Generate sample data
    data = generate_sample_data()
    
    # Initialize report
    report = StatisticsDiscussionReport("Statistical Analysis")
    report.set_data(data)
    
    # Conduct discussion rounds
    for topic in topics:
        print(f"\n{'=' * 80}")
        print(f"📊 Topic: {topic}".center(80))
        print(f"{'=' * 80}")
        
        conduct_discussion_round(
            topic,
            data,
            student_chain,
            student_memory,
            professor_chain,
            professor_memory,
            report
        )
        
        print("\n⏳ Moving to next topic...")
        import time
        time.sleep(2)
    
    # Save the report
    report_path = report.save_report()
    print(f"\n📝 Report saved to: {report_path}")
    
    print("\n" + "=" * 80)
    print("✨ Discussion Completed!".center(80))
    print("=" * 80)
