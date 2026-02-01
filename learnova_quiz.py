# ============================================================================
# LEARNOVA - AI-Powered Gamified Quiz Engine
# ============================================================================
# A Python implementation of Learnova's core quiz and gamification system.
# Learnova is an AI-powered education platform that transforms lectures into
# gamified, engaging learning experiences for the TikTok generation.
#
# This console application demonstrates the quiz engine, scoring system,
# teaching modes, badge awards, and adaptive feedback that power the
# full Learnova web platform (built with React, Node.js, and TypeScript).
#
# Authors: [Ghaleb, Hala, Feyza]
# Course: Programming Fundamentals
# Date: February 2026
# ============================================================================

import random  # Used to shuffle questions for a unique experience each time
import time    # Used for tracking quiz duration and timed challenges


# ============================================================================
# SECTION 1: DATA - Question Bank
# ============================================================================
# Questions are stored as a list of dictionaries. Each dictionary contains:
#   - "q"           : The question text (string)
#   - "options"     : A list of 4 answer choices (list of strings)
#   - "ans"         : The correct answer letter - A, B, C, or D (string)
#   - "explanation" : Why the correct answer is right (string)
#   - "difficulty"  : 1 = Easy, 2 = Medium, 3 = Hard (integer)
#   - "topic"       : The subject category (string)
# ============================================================================

QUESTION_BANK = [
    {
        "q": "What does AI stand for?",
        "options": ["A) Automated Intelligence", "B) Artificial Intelligence",
                     "C) Applied Information", "D) Advanced Integration"],
        "ans": "B",
        "explanation": "AI stands for Artificial Intelligence - the simulation of human intelligence by machines and computer systems.",
        "difficulty": 1,
        "topic": "Technology"
    },
    {
        "q": "Which planet is known as the Red Planet?",
        "options": ["A) Venus", "B) Jupiter", "C) Mars", "D) Saturn"],
        "ans": "C",
        "explanation": "Mars appears red due to iron oxide (rust) on its surface, giving it the nickname 'The Red Planet'.",
        "difficulty": 1,
        "topic": "Science"
    },
    {
        "q": "What is the largest organ in the human body?",
        "options": ["A) Liver", "B) Brain", "C) Heart", "D) Skin"],
        "ans": "D",
        "explanation": "The skin is the largest organ, covering about 20 square feet in adults and serving as a protective barrier.",
        "difficulty": 1,
        "topic": "Science"
    },
    {
        "q": "In Python, which data type is used to store a sequence of characters?",
        "options": ["A) int", "B) float", "C) str", "D) bool"],
        "ans": "C",
        "explanation": "The 'str' (string) data type in Python is used to store text - a sequence of characters.",
        "difficulty": 1,
        "topic": "Programming"
    },
    {
        "q": "What does the 'def' keyword do in Python?",
        "options": ["A) Defines a variable", "B) Defines a function",
                     "C) Defines a class", "D) Deletes a file"],
        "ans": "B",
        "explanation": "The 'def' keyword is used to define (create) a function in Python.",
        "difficulty": 1,
        "topic": "Programming"
    },
    {
        "q": "Which gas do plants absorb from the atmosphere during photosynthesis?",
        "options": ["A) Oxygen", "B) Nitrogen", "C) Carbon Dioxide", "D) Hydrogen"],
        "ans": "C",
        "explanation": "Plants absorb carbon dioxide (CO2) and use sunlight to convert it into glucose and oxygen.",
        "difficulty": 2,
        "topic": "Science"
    },
    {
        "q": "What is the time complexity of searching in a Python dictionary?",
        "options": ["A) O(n)", "B) O(log n)", "C) O(1)", "D) O(n^2)"],
        "ans": "C",
        "explanation": "Python dictionaries use hash tables, providing average O(1) constant-time lookups.",
        "difficulty": 3,
        "topic": "Programming"
    },
    {
        "q": "Which country has the largest population in the world as of 2024?",
        "options": ["A) China", "B) United States", "C) Indonesia", "D) India"],
        "ans": "D",
        "explanation": "India surpassed China in 2023 to become the world's most populous country with over 1.4 billion people.",
        "difficulty": 2,
        "topic": "General Knowledge"
    },
    {
        "q": "What does HTML stand for?",
        "options": ["A) Hyper Text Markup Language", "B) High Tech Modern Language",
                     "C) Hyper Transfer Markup Language", "D) Home Tool Markup Language"],
        "ans": "A",
        "explanation": "HTML stands for Hyper Text Markup Language - the standard language for creating web pages.",
        "difficulty": 1,
        "topic": "Technology"
    },
    {
        "q": "Which of the following is NOT a valid Python loop?",
        "options": ["A) for loop", "B) while loop", "C) do-while loop", "D) nested loop"],
        "ans": "C",
        "explanation": "Python does not have a do-while loop. It uses 'for' and 'while' loops. Nested loops are loops inside loops.",
        "difficulty": 2,
        "topic": "Programming"
    },
    {
        "q": "What is the chemical symbol for gold?",
        "options": ["A) Go", "B) Gd", "C) Au", "D) Ag"],
        "ans": "C",
        "explanation": "Gold's chemical symbol 'Au' comes from the Latin word 'aurum' meaning gold.",
        "difficulty": 2,
        "topic": "Science"
    },
    {
        "q": "In gamification, what does 'XP' typically stand for?",
        "options": ["A) Extra Points", "B) Experience Points",
                     "C) Extreme Performance", "D) Exchange Points"],
        "ans": "B",
        "explanation": "XP stands for Experience Points - a unit of measurement used in games to quantify a player's progression.",
        "difficulty": 1,
        "topic": "Technology"
    },
    {
        "q": "Which Python method is used to add an item to the end of a list?",
        "options": ["A) .add()", "B) .insert()", "C) .append()", "D) .push()"],
        "ans": "C",
        "explanation": "The .append() method adds a single item to the end of a Python list.",
        "difficulty": 2,
        "topic": "Programming"
    },
    {
        "q": "What percentage of the Earth's surface is covered by water?",
        "options": ["A) 51%", "B) 61%", "C) 71%", "D) 81%"],
        "ans": "C",
        "explanation": "Approximately 71% of Earth's surface is covered by water, with oceans holding about 96.5% of it.",
        "difficulty": 2,
        "topic": "Science"
    },
    {
        "q": "Which sorting algorithm has the best average-case time complexity?",
        "options": ["A) Bubble Sort - O(n^2)", "B) Merge Sort - O(n log n)",
                     "C) Selection Sort - O(n^2)", "D) Insertion Sort - O(n^2)"],
        "ans": "B",
        "explanation": "Merge Sort has O(n log n) average-case complexity, making it more efficient than O(n^2) algorithms.",
        "difficulty": 3,
        "topic": "Programming"
    },
]


# ============================================================================
# SECTION 2: TEACHING MODES
# ============================================================================
# Learnova's Teaching Modes adapt the quiz experience to different classroom
# dynamics. Each mode changes the quiz behavior, timing, and feedback style.
# Stored as a dictionary where keys are mode numbers and values are
# dictionaries containing the mode's name, description, and settings.
# ============================================================================

TEACHING_MODES = {
    1: {
        "name": "Focus Mode",
        "icon": "[*]",
        "description": "Deep concentration. No timer pressure. Detailed explanations after each question.",
        "timed": False,
        "time_per_question": 0,       # No time limit
        "show_explanation": True,      # Show explanation after every question
        "show_hints": True,            # Offer hints
        "xp_multiplier": 1.0          # Standard XP
    },
    2: {
        "name": "Explore Mode",
        "icon": "[?]",
        "description": "Discovery-based. See explanations for ALL answers. Learn from mistakes.",
        "timed": False,
        "time_per_question": 0,
        "show_explanation": True,      # Always show explanations
        "show_hints": True,
        "xp_multiplier": 1.0
    },
    3: {
        "name": "Pressure Mode",
        "icon": "[!]",
        "description": "Timed challenge! 15 seconds per question. Bonus XP for speed.",
        "timed": True,
        "time_per_question": 15,       # 15 seconds per question
        "show_explanation": False,     # No explanations during quiz
        "show_hints": False,           # No hints
        "xp_multiplier": 1.5          # 50% bonus XP for the challenge
    },
    4: {
        "name": "Team Mode",
        "icon": "[T]",
        "description": "Collaborative play. Discuss answers with your team. Double XP!",
        "timed": False,
        "time_per_question": 0,
        "show_explanation": True,
        "show_hints": True,
        "xp_multiplier": 2.0          # Double XP for teamwork
    },
    5: {
        "name": "Recovery Mode",
        "icon": "[~]",
        "description": "Low-pressure review. Hints available. Encouragement after every answer.",
        "timed": False,
        "time_per_question": 0,
        "show_explanation": True,
        "show_hints": True,
        "xp_multiplier": 1.0
    }
}


# ============================================================================
# SECTION 3: BADGE DEFINITIONS
# ============================================================================
# Badges reward specific achievements during the quiz. Each badge has a name,
# icon, and description. Badges are awarded after the quiz based on
# performance metrics tracked during gameplay.
# ============================================================================

BADGES = {
    "perfect_score":   {"name": "Perfect Score",   "icon": "[S]", "desc": "Answered every question correctly"},
    "quick_thinker":   {"name": "Quick Thinker",   "icon": "[Q]", "desc": "Completed the quiz in under 2 minutes"},
    "no_mistakes":     {"name": "Flawless",         "icon": "[F]", "desc": "Zero wrong answers on first try"},
    "curious_mind":    {"name": "Curious Mind",     "icon": "[C]", "desc": "Read all explanations (Focus/Explore mode)"},
    "speed_demon":     {"name": "Speed Demon",      "icon": "[D]", "desc": "Answered 5+ questions in under 5 seconds each"},
    "halfway_hero":    {"name": "Halfway Hero",     "icon": "[H]", "desc": "Got at least 50% correct"},
    "streak_master":   {"name": "Streak Master",    "icon": "[M]", "desc": "Got 5 or more correct answers in a row"},
    "topic_expert":    {"name": "Topic Expert",     "icon": "[E]", "desc": "Got all questions right in at least one topic"},
    "persistent":      {"name": "Persistent",       "icon": "[P]", "desc": "Played the quiz more than once"},
    "first_steps":     {"name": "First Steps",      "icon": "[1]", "desc": "Completed your first quiz"},
}


# ============================================================================
# SECTION 4: DISPLAY FUNCTIONS
# ============================================================================
# These functions handle all visual output - printing headers, menus, results,
# and formatting text for a clean console experience.
# ============================================================================

def print_banner():
    """Display the Learnova welcome banner with ASCII art styling."""
    print("\n" + "=" * 60)
    print("       L E A R N O V A")
    print("       AI-Powered Gamified Quiz Engine")
    print("=" * 60)
    print("  Transform learning into an epic adventure!")
    print("  Upload lectures. AI gamifies. Students engage.")
    print("=" * 60)


def print_separator(char="-", length=60):
    """Print a visual separator line using the given character."""
    print(char * length)


def display_teaching_modes():
    """
    Display all 5 teaching modes with their descriptions.
    Iterates through the TEACHING_MODES dictionary and prints
    each mode's number, icon, name, and description.
    """
    print("\n" + "=" * 60)
    print("  SELECT YOUR TEACHING MODE")
    print("=" * 60)

    # Loop through each mode in the dictionary
    for mode_num, mode_info in TEACHING_MODES.items():
        print(f"\n  {mode_num}. {mode_info['icon']} {mode_info['name']}")
        print(f"     {mode_info['description']}")
        if mode_info["timed"]:
            print(f"     Time limit: {mode_info['time_per_question']} seconds per question")
        print(f"     XP Multiplier: {mode_info['xp_multiplier']}x")

    print("\n" + "-" * 60)


def display_leaderboard(leaderboard):
    """
    Display the leaderboard showing top scores from all sessions.
    Takes a list of dictionaries, each containing player name, score, and XP.
    Sorts by XP in descending order and prints a formatted table.
    """
    if len(leaderboard) == 0:
        print("\n  No scores recorded yet. Be the first!")
        return

    # Sort leaderboard by XP (highest first) using a lambda function
    sorted_board = sorted(leaderboard, key=lambda entry: entry["xp"], reverse=True)

    print("\n" + "=" * 60)
    print("  LEADERBOARD - Top Scores")
    print("=" * 60)
    print(f"  {'Rank':<6} {'Player':<20} {'Score':<10} {'XP':<10}")
    print("  " + "-" * 50)

    # Display top 10 entries using enumerate for ranking
    for rank, entry in enumerate(sorted_board[:10], start=1):
        medal = ""
        if rank == 1:
            medal = " << Champion"
        elif rank == 2:
            medal = " << Runner-up"
        elif rank == 3:
            medal = " << Third Place"

        print(f"  {rank:<6} {entry['name']:<20} {entry['score']:<10} {entry['xp']:<10}{medal}")

    print("=" * 60)


# ============================================================================
# SECTION 5: INPUT FUNCTIONS
# ============================================================================
# These functions handle all user input with proper validation.
# They use while loops to keep asking until valid input is received.
# ============================================================================

def get_player_name():
    """
    Ask the player to enter their display name.
    Validates that the name is not empty and not longer than 20 characters.
    Returns the cleaned name as a string.
    """
    while True:
        name = input("\n  Enter your display name: ").strip()

        # Validate: name must not be empty
        if len(name) == 0:
            print("  Please enter a name!")
            continue

        # Validate: name must not exceed 20 characters
        if len(name) > 20:
            print("  Name must be 20 characters or less!")
            continue

        return name


def get_teaching_mode():
    """
    Ask the player to select a teaching mode (1-5).
    Validates input is a number between 1 and 5.
    Returns the selected mode number as an integer.
    """
    display_teaching_modes()

    while True:
        choice = input("\n  Choose your mode (1-5): ").strip()

        # Validate: must be a digit
        if not choice.isdigit():
            print("  Please enter a number between 1 and 5.")
            continue

        mode_num = int(choice)

        # Validate: must be in range 1-5
        if mode_num < 1 or mode_num > 5:
            print("  Please enter a number between 1 and 5.")
            continue

        # Confirm selection
        selected = TEACHING_MODES[mode_num]
        print(f"\n  Selected: {selected['icon']} {selected['name']}")
        print(f"  {selected['description']}")
        return mode_num


def get_answer(mode_settings):
    """
    Get the player's answer for a question, with optional timer for Pressure Mode.
    Validates that the answer is one of A, B, C, or D.
    Returns the uppercase answer letter and the time taken in seconds.
    """
    start_time = time.time()  # Record when the question was shown

    while True:
        # Show timer warning if in Pressure Mode
        if mode_settings["timed"]:
            elapsed = time.time() - start_time
            remaining = mode_settings["time_per_question"] - elapsed

            if remaining <= 0:
                print("\n  TIME'S UP! No answer recorded.")
                return "TIMEOUT", elapsed

            answer = input(f"\n  Your answer (A/B/C/D) [{remaining:.0f}s remaining]: ").strip().upper()
        else:
            answer = input("\n  Your answer (A/B/C/D): ").strip().upper()

        end_time = time.time()
        time_taken = end_time - start_time

        # Check timeout after input in Pressure Mode
        if mode_settings["timed"] and time_taken > mode_settings["time_per_question"]:
            print("\n  TIME'S UP! Too slow!")
            return "TIMEOUT", time_taken

        # Validate: answer must be A, B, C, or D
        if answer not in ["A", "B", "C", "D"]:
            print("  Invalid input! Please enter A, B, C, or D.")
            continue

        return answer, time_taken


# ============================================================================
# SECTION 6: QUIZ LOGIC FUNCTIONS
# ============================================================================
# Core game logic - asking questions, tracking scores, computing results.
# ============================================================================

def ask_question(question_dict, question_number, total_questions, mode_settings):
    """
    Display a single question and get the player's answer.

    Parameters:
        question_dict   : Dictionary containing question data
        question_number : Current question number (for display)
        total_questions : Total number of questions (for display)
        mode_settings   : The active teaching mode's settings dictionary

    Returns:
        A dictionary with:
            - "correct"     : True/False whether the answer was right
            - "time_taken"  : Seconds taken to answer
            - "question"    : The original question dictionary
            - "user_answer" : What the player chose
    """
    print(f"\n  Question {question_number} of {total_questions}")
    print(f"  Topic: {question_dict['topic']} | Difficulty: {'Easy' if question_dict['difficulty'] == 1 else 'Medium' if question_dict['difficulty'] == 2 else 'Hard'}")
    print_separator()
    print(f"\n  {question_dict['q']}\n")

    # Display all four options
    for option in question_dict["options"]:
        print(f"    {option}")

    # Show hint in modes that support it (Recovery and Focus modes)
    if mode_settings["show_hints"] and question_dict["difficulty"] >= 2:
        correct_letter = question_dict["ans"]
        # Find the correct option text
        for opt in question_dict["options"]:
            if opt.startswith(correct_letter + ")"):
                hint_text = opt[3:].strip()  # Remove "X) " prefix
                # Give a partial hint - first few characters
                hint_preview = hint_text[:max(3, len(hint_text) // 3)]
                print(f"\n  Hint: The answer starts with \"{hint_preview}...\"")
                break

    # Get the player's answer
    answer, time_taken = get_answer(mode_settings)

    # Check if the answer is correct
    is_correct = (answer == question_dict["ans"])

    # Display feedback based on the teaching mode
    if answer == "TIMEOUT":
        print("  Skipped due to timeout.")
        is_correct = False
    elif is_correct:
        # Correct answer feedback
        if mode_settings == TEACHING_MODES[5]:  # Recovery Mode - extra encouragement
            print("\n  CORRECT! Fantastic work! You're doing great, keep it up!")
        else:
            print("\n  CORRECT! Well done!")
    else:
        # Wrong answer feedback
        print(f"\n  INCORRECT. The correct answer was: {question_dict['ans']}")

        if mode_settings == TEACHING_MODES[5]:  # Recovery Mode - encouraging
            print("  Don't worry! Mistakes are how we learn. You'll get the next one!")

    # Show explanation based on mode settings
    if mode_settings["show_explanation"]:
        print(f"\n  Explanation: {question_dict['explanation']}")

    # Build and return the result dictionary
    result = {
        "correct": is_correct,
        "time_taken": time_taken,
        "question": question_dict,
        "user_answer": answer
    }

    return result


def calculate_grade(percentage):
    """
    Convert a percentage score to a letter grade.
    Uses if/elif/else chain to determine the grade.

    Parameters:
        percentage : Float representing the score percentage (0-100)

    Returns:
        A string containing the letter grade.
    """
    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B"
    elif percentage >= 60:
        return "C"
    elif percentage >= 50:
        return "D"
    else:
        return "F"


def calculate_xp(correct_count, time_taken_list, mode_settings, streak_max):
    """
    Calculate total XP (Experience Points) earned during the quiz.
    Uses Learnova's gamification formula:
        Base XP = 10 per correct answer
        Speed Bonus = extra XP for fast answers
        Streak Bonus = extra XP for consecutive correct answers
        Mode Multiplier = applied based on teaching mode

    Parameters:
        correct_count   : Number of correct answers (integer)
        time_taken_list : List of floats (time in seconds for each question)
        mode_settings   : The active teaching mode's settings dictionary
        streak_max      : Longest streak of consecutive correct answers (integer)

    Returns:
        A dictionary with base_xp, speed_bonus, streak_bonus, multiplier, and total_xp.
    """
    # Base XP: 10 points per correct answer
    base_xp = correct_count * 10

    # Speed Bonus: 5 extra XP for each answer under 5 seconds
    speed_bonus = 0
    for t in time_taken_list:
        if t < 5.0:
            speed_bonus += 5

    # Streak Bonus: 3 XP per question in the longest streak
    streak_bonus = streak_max * 3

    # Apply the teaching mode's XP multiplier
    multiplier = mode_settings["xp_multiplier"]
    total_xp = int((base_xp + speed_bonus + streak_bonus) * multiplier)

    return {
        "base_xp": base_xp,
        "speed_bonus": speed_bonus,
        "streak_bonus": streak_bonus,
        "multiplier": multiplier,
        "total_xp": total_xp
    }


def award_badges(correct_count, total_questions, total_time, time_taken_list,
                  streak_max, mode_num, play_count, topic_scores):
    """
    Determine which badges the player has earned based on their performance.
    Checks various conditions using if statements and returns a list of
    earned badge dictionaries.

    Parameters:
        correct_count   : Number of correct answers
        total_questions : Total number of questions
        total_time      : Total quiz duration in seconds
        time_taken_list : List of time taken per question
        streak_max      : Longest consecutive correct streak
        mode_num        : The teaching mode number used
        play_count      : How many times the player has played
        topic_scores    : Dictionary mapping topic names to [correct, total] lists

    Returns:
        A list of badge dictionaries (each with name, icon, desc).
    """
    earned = []

    # First Steps - always awarded on first completion
    earned.append(BADGES["first_steps"])

    # Perfect Score - all questions correct
    if correct_count == total_questions:
        earned.append(BADGES["perfect_score"])
        earned.append(BADGES["no_mistakes"])

    # Quick Thinker - finished in under 2 minutes
    if total_time < 120:
        earned.append(BADGES["quick_thinker"])

    # Speed Demon - 5+ answers in under 5 seconds each
    fast_answers = 0
    for t in time_taken_list:
        if t < 5.0:
            fast_answers += 1
    if fast_answers >= 5:
        earned.append(BADGES["speed_demon"])

    # Halfway Hero - at least 50% correct
    if correct_count >= total_questions / 2:
        earned.append(BADGES["halfway_hero"])

    # Streak Master - 5+ correct in a row
    if streak_max >= 5:
        earned.append(BADGES["streak_master"])

    # Persistent - played more than once
    if play_count > 1:
        earned.append(BADGES["persistent"])

    # Topic Expert - got all questions right in at least one topic
    for topic, scores in topic_scores.items():
        if scores[0] == scores[1] and scores[1] > 0:  # All correct in this topic
            earned.append(BADGES["topic_expert"])
            break  # Only award once even if expert in multiple topics

    return earned


# ============================================================================
# SECTION 7: RESULTS DISPLAY
# ============================================================================
# Functions for showing the final quiz results, XP breakdown, and badges.
# ============================================================================

def display_results(player_name, results_list, xp_info, badges_earned, grade,
                    percentage, mode_name, total_time):
    """
    Display the complete quiz results summary.
    Shows score, grade, XP breakdown, earned badges, and wrong answers review.

    Parameters:
        player_name   : The player's display name
        results_list  : List of result dictionaries from each question
        xp_info       : XP calculation dictionary from calculate_xp()
        badges_earned : List of badge dictionaries from award_badges()
        grade         : Letter grade string
        percentage    : Score percentage float
        mode_name     : Name of the teaching mode used
        total_time    : Total time taken in seconds
    """
    correct_count = 0
    for r in results_list:
        if r["correct"]:
            correct_count += 1
    total_questions = len(results_list)

    print("\n" + "=" * 60)
    print("  QUIZ COMPLETE - RESULTS")
    print("=" * 60)

    # Player summary
    print(f"\n  Player:         {player_name}")
    print(f"  Teaching Mode:  {mode_name}")
    print(f"  Time Taken:     {total_time:.1f} seconds")
    print(f"\n  Score:          {correct_count} / {total_questions}")
    print(f"  Percentage:     {percentage:.1f}%")
    print(f"  Grade:          {grade}")

    # XP Breakdown
    print("\n  " + "-" * 40)
    print("  XP BREAKDOWN")
    print("  " + "-" * 40)
    print(f"  Base XP:        {xp_info['base_xp']} ({correct_count} x 10)")
    print(f"  Speed Bonus:    +{xp_info['speed_bonus']}")
    print(f"  Streak Bonus:   +{xp_info['streak_bonus']}")
    print(f"  Mode Multiplier: x{xp_info['multiplier']}")
    print(f"  -------------------------")
    print(f"  TOTAL XP:       {xp_info['total_xp']} XP")

    # Badges
    print("\n  " + "-" * 40)
    print("  BADGES EARNED")
    print("  " + "-" * 40)

    if len(badges_earned) == 0:
        print("  No badges earned this round. Keep trying!")
    else:
        for badge in badges_earned:
            print(f"  {badge['icon']} {badge['name']} - {badge['desc']}")

    # Wrong answers review
    wrong_answers = []
    for r in results_list:
        if not r["correct"]:
            wrong_answers.append(r)

    if len(wrong_answers) > 0:
        print("\n  " + "-" * 40)
        print("  REVIEW - Questions You Missed")
        print("  " + "-" * 40)

        for i, wrong in enumerate(wrong_answers, start=1):
            q = wrong["question"]
            print(f"\n  {i}. {q['q']}")
            print(f"     Your answer: {wrong['user_answer']}")
            print(f"     Correct answer: {q['ans']}")
            print(f"     {q['explanation']}")

    print("\n" + "=" * 60)


# ============================================================================
# SECTION 8: MAIN QUIZ FUNCTION
# ============================================================================
# The run_quiz function orchestrates the entire quiz session - selecting
# questions, running the game loop, tracking statistics, and computing results.
# ============================================================================

def run_quiz(player_name, mode_num, num_questions=10, play_count=1):
    """
    Run a complete quiz session from start to finish.

    Parameters:
        player_name   : The player's display name (string)
        mode_num      : Selected teaching mode 1-5 (integer)
        num_questions  : How many questions to ask (integer, default 10)
        play_count    : How many times this player has played (integer)

    Returns:
        A dictionary with the session results including score, xp, grade, etc.
    """
    mode_settings = TEACHING_MODES[mode_num]

    print(f"\n  Starting quiz in {mode_settings['icon']} {mode_settings['name']}...")
    print(f"  {num_questions} questions. Let's go!\n")
    print_separator("=")

    # Prepare questions: shuffle for randomized order
    questions = QUESTION_BANK.copy()  # Copy so we don't modify the original
    random.shuffle(questions)

    # Limit to requested number of questions
    if num_questions < len(questions):
        questions = questions[:num_questions]

    # Initialize tracking variables
    results_list = []        # List to store each question's result
    time_taken_list = []     # List to store time taken per question
    current_streak = 0       # Current consecutive correct answers
    max_streak = 0           # Longest streak achieved
    topic_scores = {}        # Dictionary to track scores per topic

    # Record quiz start time
    quiz_start_time = time.time()

    # ---- MAIN QUIZ LOOP ----
    # Iterate through each question using enumerate for the question number
    for i, question in enumerate(questions, start=1):

        # Initialize topic tracking if this is the first question of this topic
        topic = question["topic"]
        if topic not in topic_scores:
            topic_scores[topic] = [0, 0]  # [correct, total]

        # Ask the question and get the result
        result = ask_question(question, i, len(questions), mode_settings)
        results_list.append(result)
        time_taken_list.append(result["time_taken"])

        # Update topic scores
        topic_scores[topic][1] += 1  # Increment total for this topic
        if result["correct"]:
            topic_scores[topic][0] += 1  # Increment correct for this topic

        # Update streak tracking
        if result["correct"]:
            current_streak += 1
            if current_streak > max_streak:
                max_streak = current_streak
        else:
            current_streak = 0  # Reset streak on wrong answer

        # Show running score
        correct_so_far = 0
        for r in results_list:
            if r["correct"]:
                correct_so_far += 1
        print(f"\n  Running Score: {correct_so_far}/{i} | Streak: {current_streak}")
        print_separator()

    # Record quiz end time and calculate duration
    quiz_end_time = time.time()
    total_time = quiz_end_time - quiz_start_time

    # ---- CALCULATE FINAL RESULTS ----
    correct_count = 0
    for r in results_list:
        if r["correct"]:
            correct_count += 1

    total_questions = len(questions)

    # Calculate percentage (handle division by zero)
    if total_questions > 0:
        percentage = (correct_count / total_questions) * 100
    else:
        percentage = 0.0

    # Calculate letter grade
    grade = calculate_grade(percentage)

    # Calculate XP
    xp_info = calculate_xp(correct_count, time_taken_list, mode_settings, max_streak)

    # Award badges
    badges_earned = award_badges(
        correct_count, total_questions, total_time, time_taken_list,
        max_streak, mode_num, play_count, topic_scores
    )

    # Display results
    display_results(
        player_name, results_list, xp_info, badges_earned,
        grade, percentage, mode_settings["name"], total_time
    )

    # Return session data for leaderboard
    return {
        "name": player_name,
        "score": f"{correct_count}/{total_questions}",
        "percentage": percentage,
        "grade": grade,
        "xp": xp_info["total_xp"],
        "badges": len(badges_earned),
        "mode": mode_settings["name"],
        "time": total_time
    }


# ============================================================================
# SECTION 9: MAIN MENU & GAME LOOP
# ============================================================================
# The main() function is the entry point. It shows the main menu, handles
# navigation between quiz, leaderboard, and settings, and manages the
# overall game loop using a while loop.
# ============================================================================

def main():
    """
    Main entry point for the Learnova Quiz Engine.
    Displays the main menu and handles the game loop.
    Uses a while loop that continues until the player chooses to exit.
    """
    # Display welcome banner
    print_banner()

    # Get player name
    player_name = get_player_name()
    print(f"\n  Welcome, {player_name}! Ready to learn?")

    # Initialize persistent data
    leaderboard = []   # List of all session results (persists across rounds)
    play_count = 0     # Track how many times the player has played

    # ---- MAIN MENU LOOP ----
    running = True
    while running:
        print("\n" + "=" * 60)
        print("  MAIN MENU")
        print("=" * 60)
        print("\n  1. Start New Quiz")
        print("  2. View Leaderboard")
        print("  3. About Learnova")
        print("  4. Exit")
        print_separator()

        choice = input("\n  Select option (1-4): ").strip()

        if choice == "1":
            # Start a new quiz
            mode_num = get_teaching_mode()
            play_count += 1

            # Ask how many questions
            print(f"\n  Available questions: {len(QUESTION_BANK)}")
            q_count_input = input(f"  How many questions? (1-{len(QUESTION_BANK)}, Enter for 10): ").strip()

            if q_count_input == "":
                num_questions = 10
            elif q_count_input.isdigit() and 1 <= int(q_count_input) <= len(QUESTION_BANK):
                num_questions = int(q_count_input)
            else:
                print("  Invalid number. Using 10 questions.")
                num_questions = 10

            # Run the quiz and get results
            session_result = run_quiz(player_name, mode_num, num_questions, play_count)

            # Add to leaderboard
            leaderboard.append(session_result)

        elif choice == "2":
            # View leaderboard
            display_leaderboard(leaderboard)

        elif choice == "3":
            # About section
            print("\n" + "=" * 60)
            print("  ABOUT LEARNOVA")
            print("=" * 60)
            print("""
  Learnova is an AI-powered education platform that transforms
  any lecture material into gamified, engaging lesson plans in
  seconds.

  The full platform (built with React, Node.js, and TypeScript)
  allows teachers to:
    - Upload any lecture material (PDF, PPTX, DOCX, text)
    - Select a Teaching Mode for their classroom dynamic
    - Get AI-generated gamified lesson plans in under 60 seconds
    - Run live quizzes where students join from their phones
    - Track progress with XP, badges, and leaderboards

  This Python version demonstrates the core quiz engine and
  gamification system that powers the full Learnova platform.

  Built by: Ghaleb, Hala, Feyza
  Course: Programming Fundamentals | February 2026
            """)
            print("=" * 60)

        elif choice == "4":
            # Exit
            print(f"\n  Thanks for playing, {player_name}!")
            print("  Keep learning, keep growing.")
            print("  Powered by Learnova\n")
            running = False

        else:
            print("  Invalid option. Please enter 1, 2, 3, or 4.")


# ============================================================================
# SECTION 10: PROGRAM ENTRY POINT
# ============================================================================
# This is the standard Python entry point. The if __name__ == "__main__"
# check ensures main() only runs when this file is executed directly,
# not when it is imported as a module.
# ============================================================================

if __name__ == "__main__":
    main()
