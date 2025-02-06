import json
import tkinter as tk
from tkinter import filedialog, messagebox
import ollama
import webbrowser
import markdown
from bs4 import BeautifulSoup

def select_file():
    """Open a file dialog to select a JSON or Markdown file."""
    file_path = filedialog.askopenfilename(
        title="Select a JSON or Markdown File",
        filetypes=[("JSON and Markdown Files", "*.json *.md"), ("All Files", "*.*")]
    )
    if file_path:
        try:
            if file_path.endswith('.json'):
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                ask_ollama_to_format(data)
            elif file_path.endswith('.md'):
                with open(file_path, 'r', encoding='utf-8') as file:
                    markdown_content = file.read()
                convert_markdown_to_html(markdown_content)
            else:
                messagebox.showerror("Error", "Unsupported file type selected.")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load file:\n{e}")

def ask_ollama_to_format(data):
    """Send JSON data to Ollama and get structured HTML table output."""
    json_data = json.dumps(data, indent=4)
    
    prompt = f"""
    Here is some JSON data:
    ```json
    {json_data}
    ```
    Please format this into a clean and structured **HTML table**.
    Ensure the table is fully formatted with proper headers, rows, and styling.
    Do not include extra explanations, just return the pure HTML code.
    """

    try:
        response = ollama.chat(model="llama3.2:1b", messages=[{"role": "user", "content": prompt}])
        if 'message' in response and 'content' in response['message']:
            html_table = response['message']['content']
            save_and_display_html(html_table)
        else:
            messagebox.showerror("Error", "Invalid response structure from Ollama.")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to get response from Ollama:\n{e}")

def convert_markdown_to_html(markdown_content):
    """Convert Markdown content to HTML and display it."""
    try:
        html_content = markdown.markdown(markdown_content)
        # Optionally, prettify the HTML using BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        pretty_html = soup.prettify()
        save_and_display_html(pretty_html)
    except Exception as e:
        messagebox.showerror("Error", f"Failed to convert Markdown to HTML:\n{e}")

def save_and_display_html(html_content):
    """Save the HTML content to a file and open it in the browser."""
    html_file = "output.html"
    
    full_html = f"""
    <html>
    <head>
        <title>Formatted Output</title>
        <style>
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ border: 1px solid black; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    try:
        with open(html_file, "w", encoding="utf-8") as file:
            file.write(full_html)
        webbrowser.open(html_file)  # Open in default web browser
    except Exception as e:
        messagebox.showerror("Error", f"Failed to save or display HTML file:\n{e}")

# Initialize the main application window
root = tk.Tk()
root.title("File to HTML Converter")
root.geometry("400x200")

# Add a button to open the file dialog
open_button = tk.Button(root, text="Open JSON or Markdown File", command=select_file, font=("Arial", 12))
open_button.pack(pady=20)

root.mainloop()
