#0.student_prof_stat_discuss_crewai_with_report.py
import os
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass
from typing import List
from crewai import Agent, Task, Crew, LLM

# Set environment variables if needed
os.environ['OPENAI_API_BASE'] = 'http://localhost:11434'
os.environ['OPENAI_API_KEY'] = ''  # Leave empty if not required

@dataclass
class DiscussionMessage:
    role: str
    content: str
    timestamp: str
    topic: str

class StatisticsDiscussionReport:
    def __init__(self):
        self.messages: List[DiscussionMessage] = []
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.summary = ""
        
    def add_message(self, role: str, content: str, topic: str):
        """Add a message to the discussion history"""
        message = DiscussionMessage(
            role=role,
            content=content,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            topic=topic
        )
        self.messages.append(message)
    
    def set_summary(self, summary: str):
        """Set the discussion summary"""
        self.summary = summary
    
    def generate_report(self) -> str:
        """Generate HTML report of the discussion"""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Statistics Discussion Report</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background-color: #f5f5f5;
                    padding: 20px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }}
                .message {{
                    margin: 20px 0;
                    padding: 15px;
                    border-radius: 5px;
                }}
                .Student {{
                    background-color: #e3f2fd;
                }}
                .Professor {{
                    background-color: #f5f5f5;
                }}
                .meta {{
                    font-size: 0.8em;
                    color: #666;
                }}
                .summary {{
                    background-color: #fff3e0;
                    padding: 20px;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Statistics Discussion Report</h1>
                <p>Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
            </div>
            
            <div class="summary">
                <h2>Discussion Summary</h2>
                <p>{self.summary}</p>
            </div>
            
            <h2>Discussion Details</h2>
        """
        
        current_topic = ""
        for msg in self.messages:
            if msg.topic != current_topic:
                current_topic = msg.topic
                html += f"<h3>Topic: {current_topic}</h3>"
            
            html += f"""
            <div class="message {msg.role}">
                <div class="meta">
                    <strong>{msg.role}</strong> | {msg.timestamp}
                </div>
                <p>{msg.content}</p>
            </div>
            """
        
        html += """
        </body>
        </html>
        """
        return html
    
    def save_report(self, output_dir: str = "reports"):
        """Save the report to an HTML file"""
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        report_path = Path(output_dir) / f"0.student_prof_stat_discuss_crewai_with_report_{self.timestamp}.html"
        
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(self.generate_report())
        
        return report_path

# Initialize the LLM with the Ollama model
llm = LLM(
    model="ollama/llama3.2:1b",  # Replace with your specific model name
    api_base="http://localhost:11434",
    api_key=os.environ['OPENAI_API_KEY']
)

# Create a report instance
report = StatisticsDiscussionReport()

# Define the agents
student1 = Agent(
    role='Student',
    goal='Understand the concept of p-values in statistics',
    backstory="A diligent student seeking to grasp statistical concepts.",
    verbose=True,
    llm=llm
)

student2 = Agent(
    role='Student',
    goal='Learn about confidence intervals in statistics',
    backstory="An inquisitive student aiming to excel in statistics.",
    verbose=True,
    llm=llm
)

professor = Agent(
    role='Professor',
    goal='Teach statistical concepts effectively',
    backstory="An experienced professor passionate about teaching statistics.",
    verbose=True,
    llm=llm
)

# Define the tasks with report integration
task1 = Task(
    description="""Student1 asks about the concept of p-values. 
    After getting the response, add it to the report with appropriate topic.""",
    expected_output="Explanation of p-values and report update.",
    agent=student1
)

task2 = Task(
    description="""Student2 inquires about confidence intervals. 
    After getting the response, add it to the report with appropriate topic.""",
    expected_output="Explanation of confidence intervals and report update.",
    agent=student2
)

task3 = Task(
    description="""Professor provides detailed explanations to both students.
    After the explanation, add it to the report with appropriate topic.""",
    expected_output="Comprehensive explanations and report update.",
    agent=professor
)

# Create the crew
crew = Crew(
    agents=[student1, student2, professor],
    tasks=[task1, task2, task3],
    verbose=True
)

# Execute the tasks and generate the report
result = crew.kickoff()

# Add the discussion to the report
report.add_message("Student", str(result), "Statistical Discussion")

# Add a summary
report.set_summary("""
This discussion covered fundamental statistical concepts including p-values and confidence intervals. 
The students asked insightful questions, and the professor provided comprehensive explanations 
to help them understand these important statistical tools.
""")

# Save the report
report_path = report.save_report()
print(f"\nReport has been generated and saved to: {report_path}")
