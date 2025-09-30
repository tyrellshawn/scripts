import os

def should_ignore(name):
    return name.startswith('.') or name == 'node_modules'

def generate_ascii_tree(root_path, prefix="", is_last=True):
    base_name = os.path.basename(root_path)
    connector = "└── " if is_last else "├── "
    print(f"{prefix}{connector}{base_name}")

    if os.path.isdir(root_path):
        prefix += "    " if is_last else "│   "
        contents = sorted([item for item in os.listdir(root_path) if not should_ignore(item)])
        for i, item in enumerate(contents):
            item_path = os.path.join(root_path, item)
            generate_ascii_tree(item_path, prefix, i == len(contents) - 1)

def main():
    root_folder = os.getcwd()
    print(f"\nASCII File Structure for: {root_folder}\n")
    generate_ascii_tree(root_folder)

if __name__ == "__main__":
    main()