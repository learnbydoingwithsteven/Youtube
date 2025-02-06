import tkinter as tk
from tkinter import filedialog
from docling.document_converter import DocumentConverter
import json


converter = DocumentConverter()


def select_input_file():
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename(
        title="Select a Document",
        filetypes=[("All Files", "*.*"), ("PDF Files", "*.pdf"), ("Word Documents", "*.docx")]
    )
    return file_path


def select_output_file(file_type):
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.asksaveasfilename(
        title=f"Save {file_type} Output As",
        defaultextension=f".{file_type.lower()}",
        filetypes=[(f"{file_type} Files", f"*.{file_type.lower()}"), ("All Files", "*.*")]
    )
    return file_path


def save_to_file(content, file_path, is_json=False):
    with open(file_path, 'w', encoding='utf-8') as file:
        if is_json:
            json.dump(content, file, ensure_ascii=False, indent=4)
        else:
            file.write(content)


if __name__ == "__main__":
    input_file_path = select_input_file()
    if input_file_path:
        # Convert the selected document
        result = converter.convert(input_file_path)

        # Export to Markdown
        markdown_output = result.document.export_to_markdown()
        markdown_file_path = select_output_file("Markdown")
        if markdown_file_path:
            save_to_file(markdown_output, markdown_file_path)
            print(f"Markdown output saved to: {markdown_file_path}")

        # Export to JSON
        json_output = result.document.export_to_dict()
        json_file_path = select_output_file("JSON")
        if json_file_path:
            save_to_file(json_output, json_file_path, is_json=True)
            print(f"JSON output saved to: {json_file_path}")
    else:
        print("No input file selected.")
