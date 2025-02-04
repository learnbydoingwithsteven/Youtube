# 0.student_prof_stat_discuss_autogen_with_report.py
import os
from datetime import datetime
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOllama

# Configure environment
os.environ['OPENAI_API_BASE'] = 'http://localhost:11434'
os.environ['OPENAI_API_KEY'] = ''

# Initialize the Ollama model
llm = ChatOllama(model="llama3.2:1b")

class HTMLReportGenerator:
    def __init__(self):
        self.messages = []
        
    def add_message(self, role, content):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.messages.append({
            'role': role,
            'content': content,
            'timestamp': timestamp
        })
    
    def generate_html(self):
        css = """
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .message {
                margin: 15px 0;
                padding: 15px;
                border-radius: 10px;
                position: relative;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .timestamp {
                font-size: 0.8em;
                color: #666;
                margin-bottom: 5px;
            }
            .speaker-label {
                font-weight: bold;
                margin-bottom: 10px;
                display: inline-block;
                padding: 3px 8px;
                border-radius: 4px;
                color: white;
            }
            .student {
                background-color: #ffffff;
                border-left: 5px solid #4CAF50;
            }
            .student .speaker-label {
                background-color: #4CAF50;
            }
            .professor {
                background-color: #ffffff;
                border-left: 5px solid #2196F3;
            }
            .professor .speaker-label {
                background-color: #2196F3;
            }
            .content {
                line-height: 1.6;
                color: #333;
            }
            h1 {
                color: #333;
                text-align: center;
                padding: 20px 0;
                border-bottom: 2px solid #ddd;
            }
            .message::before {
                content: '';
                position: absolute;
                left: -7px;
                top: 20px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }
            .student::before {
                background-color: #4CAF50;
            }
            .professor::before {
                background-color: #2196F3;
            }
        </style>
        """
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Statistics Discussion Report</title>
            {css}
        </head>
        <body>
            <h1>🎓 Student-Professor Statistics Discussion</h1>
        """
        
        for msg in self.messages:
            html += f"""
            <div class="message {msg['role'].lower()}">
                <div class="timestamp">{msg['timestamp']}</div>
                <div class="speaker-label">{msg['role']}</div>
                <div class="content">{msg['content']}</div>
            </div>
            """
        
        html += """
        </body>
        </html>
        """
        return html

def save_report(html_content):
    # Create reports directory if it doesn't exist
    reports_dir = "reports"
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)

    # Generate filename with current date and time
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"0.student_prof_stat_discuss_autogen_with_report_{current_time}.html"

    # Full path for the report
    filepath = os.path.join(reports_dir, filename)

    # Save the report
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"\nReport saved as: {filepath}")

# Create prompt templates
student_template = """
You are a curious and motivated statistics student who asks thoughtful questions.
Current topic of discussion: {topic}
Previous context: {context}

Ask a relevant, insightful question about this topic that demonstrates both understanding and curiosity.
Keep your question focused and specific, showing that you've thought carefully about the subject matter.
"""

professor_template = """
You are a knowledgeable and patient statistics professor who provides clear, detailed explanations.
Student's question: {question}
Current topic: {topic}
Previous context: {context}

Provide a thorough, well-structured response that:
1. Addresses the student's question directly
2. Includes relevant examples or analogies when helpful
3. Connects the concept to broader statistical principles
4. Encourages further thinking and exploration

Make your explanation clear and accessible while maintaining academic rigor.
"""

# Create chains
student_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["topic", "context"],
        template=student_template
    )
)

professor_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["question", "topic", "context"],
        template=professor_template
    )
)

def generate_discussion(initial_topic, num_exchanges=3):
    report = HTMLReportGenerator()
    context = "Beginning of discussion"
    
    print(f"\n{'='*80}")
    print(f"Starting discussion on: {initial_topic}")
    print(f"{'='*80}\n")
    
    for i in range(num_exchanges):
        print(f"\nExchange {i+1}:")
        print("-" * 40)
        
        # Generate student question
        student_question = student_chain.run(topic=initial_topic, context=context)
        print("\nStudent:", student_question)
        report.add_message("Student", student_question)
        
        # Generate professor response
        professor_response = professor_chain.run(
            question=student_question,
            topic=initial_topic,
            context=context
        )
        print("\nProfessor:", professor_response)
        report.add_message("Professor", professor_response)
        
        # Update context
        context = f"Previous exchange - Question: {student_question} Response: {professor_response}"
    
    # Generate and save HTML report
    html_report = report.generate_html()
    save_report(html_report)
    print("\nDiscussion report has been saved to 'statistics_discussion_report.html'")

if __name__ == "__main__":
    # Example topics for statistical discussions
    topics = [
        "Hypothesis Testing and P-values",
        "Bayesian vs Frequentist Statistics",
        "Regression Analysis and Model Fitting",
        "Sampling Methods and Distribution Theory",
        "Statistical Power and Effect Size"
    ]
    
    # Generate discussion for the first topic
    generate_discussion(topics[0])
