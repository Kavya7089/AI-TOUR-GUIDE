# main.py
from groq_api import ask_groq
from prompts import generate_prompt

def run():
    print("🌍 Welcome to the AI Tour Guide!")
    location = input("📍 Where are you currently (e.g., Taj Mahal, Eiffel Tower)?\n> ")
    
    print("\n🧠 Thinking...\n")
    prompt = generate_prompt(location)
    try:
        response = ask_groq(prompt)
        print("🎤 Tour Guide Says:\n")
        print(response)
    except Exception as e:
        print("❌ Error:", e)

if __name__ == "__main__":
    run()
