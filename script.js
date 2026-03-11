document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diet-form');
    const inputSection = document.getElementById('input-section');
    const resultSection = document.getElementById('result-section');
    const recalculateBtn = document.getElementById('recalculate-btn');
    
    const calcCaloriesEl = document.getElementById('calc-calories');
    const calcWaterEl = document.getElementById('calc-water');
    const weeklyPlanEl = document.getElementById('weekly-plan');
    
    // Kerala Diet Database
    const meals = {
        veg: {
            breakfast: [
                "Puttu (1 portion) with Kadala Curry & 1 boiled egg white",
                "Idiyappam (2-3) with Veg Stew",
                "Appam (2 pcs) with Mixed Veg Kurma",
                "Oats Upma with finely chopped veggies",
                "Dosa (2 plain) with Sambar & green chutney"
            ],
            lunch: [
                "Kerala Matta Rice (1 small cup) with Sambar, Cabbage Thoran, and Buttermilk",
                "Matta Rice (1 cup) with Parippu Curry, Avial, and salad",
                "Chapati (2 pcs) with Green Gram (Cherupayar) Curry & Cucumber salad",
                "Matta Rice (1 cup) with Moru Curry, Beans Thoran",
                "Broken Wheat (Nurukku Gothambu) Upma with spicy veg curry"
            ],
            dinner: [
                "Chapati (2) with Mixed Vegetable Curry",
                "Wheat Puttu with Green Gram (Cherupayar) Curry",
                "Salad with cucumber, tomato, carrot and paneer pieces",
                "Dosa (2 pcs) with Tomato Chutney and a bowl of clear soup",
                "Oats Kanji (porridge) with a side of stir-fried veggies"
            ]
        },
        nonveg: {
            breakfast: [
                "Puttu with Egg Roast (2 egg whites, 1 whole)",
                "Appam (2 pcs) with Chicken Stew (less coconut milk)",
                "Idiyappam with Egg Curry",
                "Dosa (2 pcs) with Fish Molee (light gravy)",
                "Oats Upma with boiled eggs"
            ],
            lunch: [
                "Kerala Matta Rice (1 small cup) with Fish Curry (Meen Mulakittathu) & Cabbage Thoran",
                "Matta Rice (1 cup) with Chicken Curry (Naadan style, less oil) & Salad",
                "Chapati (2) with Dry Kerala Beef Roast (lean meat, controlled portion) & Cucumber",
                "Matta Rice with Moru Curry, Fish Fry (shallow fried)",
                "Broken wheat with leftover spicy chicken or fish curry"
            ],
            dinner: [
                "Chapati (2 pcs) with Chicken Roast (dry)",
                "Grilled Fish (Kerala spices) with mixed tossed salad",
                "Wheat Dosa with Egg roast",
                "Clear Chicken Soup with a small portion of Wheat Puttu",
                "Appam (1-2 pcs) with light Fish Stew"
            ]
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather inputs
        const gender = document.getElementById('gender').value;
        const age = parseInt(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseInt(document.getElementById('height').value);
        const activity = parseFloat(document.getElementById('activity').value);
        const preference = document.getElementById('preference').value;
        const goalSpeed = document.getElementById('goal-speed').value;
        
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr = 0;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        
        // Calculate TDEE
        const tdee = bmr * activity;
        
        // Apply deficit based on goal speed
        let deficit = 0;
        if (goalSpeed === 'slow') deficit = 250;
        else if (goalSpeed === 'normal') deficit = 500;
        else if (goalSpeed === 'fast') deficit = 800; // Cap at 800 roughly for health
        
        let targetCalories = Math.round(tdee - deficit);
        
        // Safety bounds
        if (gender === 'male' && targetCalories < 1500) targetCalories = 1500;
        if (gender === 'female' && targetCalories < 1200) targetCalories = 1200;
        
        // Water Intake (roughly weight in kg * 0.033) increased slightly for fat loss
        let waterIntake = (weight * 0.035).toFixed(1);
        
        // Show Results
        calcCaloriesEl.textContent = `${targetCalories} kcal`;
        calcWaterEl.textContent = `${waterIntake} L`;
        
        renderWeeklyPlan(preference);
        renderGroceryList(preference);
        
        // Switch sections
        inputSection.classList.remove('active-section');
        inputSection.classList.add('hidden-section');
        setTimeout(() => {
            inputSection.style.display = 'none';
            resultSection.style.display = 'block';
            setTimeout(() => {
                resultSection.classList.remove('hidden-section');
                resultSection.classList.add('active-section');
            }, 50);
        }, 300);
    });
    
    recalculateBtn.addEventListener('click', () => {
        // Switch sections back
        resultSection.classList.remove('active-section');
        resultSection.classList.add('hidden-section');
        setTimeout(() => {
            resultSection.style.display = 'none';
            inputSection.style.display = 'block';
            setTimeout(() => {
                inputSection.classList.remove('hidden-section');
                inputSection.classList.add('active-section');
            }, 50);
        }, 300);
    });
    
    function renderWeeklyPlan(preference) {
        weeklyPlanEl.innerHTML = '';
        const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
        
        const dietDB = meals[preference];
        
        days.forEach((day, index) => {
            const bIndex = index % dietDB.breakfast.length;
            const lIndex = index % dietDB.lunch.length;
            const dIndex = index % dietDB.dinner.length;
            
            const card = document.createElement('div');
            card.className = 'day-card';
            
            card.innerHTML = `
                <div class="day-header">${day}</div>
                <div class="meal-body">
                    <div class="meal-row">
                        <div class="meal-time">Breakfast</div>
                        <div class="meal-desc">${dietDB.breakfast[bIndex]}</div>
                    </div>
                    <div class="meal-row">
                        <div class="meal-time">Lunch</div>
                        <div class="meal-desc">${dietDB.lunch[lIndex]}</div>
                    </div>
                    <div class="meal-row">
                        <div class="meal-time">Dinner</div>
                        <div class="meal-desc">${dietDB.dinner[dIndex]}</div>
                    </div>
                </div>
            `;
            weeklyPlanEl.appendChild(card);
        });
    }

    function renderGroceryList(preference) {
        const groceryListEl = document.getElementById('grocery-list');
        if (!groceryListEl) return;
        
        groceryListEl.innerHTML = '';
        
        const commonItems = [
            "Onions (1 kg)", "Tomatoes (1 kg)", "Green Chilies (100g)",
            "Ginger & Garlic (100g each)", "Curry Leaves (2 bunches)",
            "Coconut Oil (500ml)", "Grated Coconut (2-3 whole)",
            "Kerala Matta Rice (2 kg)", "Wheat Flour / Atta (1 kg)",
            "Oats (500g)"
        ];
        
        let specificItems = [];
        
        if (preference === 'veg') {
            specificItems = [
                "Puttu Podi (500g)", "Appam/Idiyappam Podi (500g)",
                "Dosa/Idli Batter (1 kg)", "Kadala (Black Chickpeas) (500g)",
                "Cherupayar (Green Gram) (500g)", "Toor Dal (500g)",
                "Mixed Veggies (Carrot, Beans, Potato) (1.5 kg)",
                "Cabbage (1 medium)", "Cucumber (500g)",
                "Paneer (200g)", "Eggs (6 pcs - optional)"
            ];
        } else {
            specificItems = [
                "Puttu/Appam/Idiyappam Podi (1 kg total)",
                "Dosa/Idli Batter (1 kg)", "Eggs (1 dozen)",
                "Chicken (Lean cuts, 1 kg)", "Fish (1 kg)",
                "Lean Beef (500g) (Optional)",
                "Veggies for Stew/Curry (Carrot, Potato) (500g)",
                "Cabbage (1 small)", "Cucumber (500g)",
            ];
        }
        
        const items = [...specificItems, ...commonItems];
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            groceryListEl.appendChild(li);
        });
    }
});
