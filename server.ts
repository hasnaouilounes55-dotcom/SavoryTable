import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check endpoints for Cloud Run / load balancers
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static assets in both dev and production
const localAssets = path.join(__dirname, 'src/assets');
if (fs.existsSync(localAssets)) {
  app.use('/src/assets', express.static(localAssets));
}
const distAssets = path.join(__dirname, 'dist/src/assets');
if (fs.existsSync(distAssets)) {
  app.use('/src/assets', express.static(distAssets));
}


// In-memory Community Recipe Requests
interface RecipeRequest {
  id: string;
  dishName: string;
  cuisine: string;
  notes: string;
  requestedBy: string;
  votes: number;
  createdAt: string;
  status: 'Testing' | 'In Development' | 'Published';
}

const communityRequests: RecipeRequest[] = [
  {
    id: 'req-1',
    dishName: 'Authentic Spanish Paella Valenciana',
    cuisine: 'Spanish',
    notes: 'Looking for a traditional rabbit and green bean paella with crispy socarrat on bottom.',
    requestedBy: 'Elena R.',
    votes: 42,
    createdAt: '2026-09-28',
    status: 'In Development',
  },
  {
    id: 'req-2',
    dishName: 'Japanese Fluffy Soufflé Pancakes',
    cuisine: 'Japanese',
    notes: 'Tall, jiggly pancakes that do not deflate within 2 minutes of serving!',
    requestedBy: 'Kenji T.',
    votes: 38,
    createdAt: '2026-09-30',
    status: 'Testing',
  },
  {
    id: 'req-3',
    dishName: 'Georgian Khachapuri Adjaruli',
    cuisine: 'Georgian',
    notes: 'Cheese boat bread with runny egg yolk and butter swirl.',
    requestedBy: 'Nika M.',
    votes: 29,
    createdAt: '2026-10-01',
    status: 'Published',
  },
  {
    id: 'req-4',
    dishName: 'Traditional Moroccan Tagine with Preserved Lemon',
    cuisine: 'Moroccan',
    notes: 'Tender lamb or chicken with warm spices, olives, and authentic slow-cook method.',
    requestedBy: 'Youssef B.',
    votes: 25,
    createdAt: '2026-10-02',
    status: 'Testing',
  },
];

// Server-side Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

// Endpoint: Ask for new recipe recommendations via Gemini AI
app.post('/api/recommendations', async (req, res) => {
  try {
    const { prompt, ingredients, cuisine, dietary, prepTime } = req.body;

    const userPrompt = `
You are a master culinary chef and recipe developer.
A home cook is asking for an original, delicious, tested recipe recommendation based on these preferences:
- User request/craving: ${prompt || 'Inspire me with something seasonal and comforting'}
- Available ingredients / Must-use items: ${ingredients || 'Any standard pantry staples'}
- Preferred cuisine: ${cuisine || 'Chef choice'}
- Dietary requirements / Allergies: ${dietary || 'None specified'}
- Available time: ${prepTime || 'Under 45 minutes'}

Provide a complete, realistic recipe in JSON format with precise measurements, step-by-step instructions with chef secrets, and a recommended YouTube search or video title.
`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: 'You are an award-winning executive chef. Provide authentic, highly dependable recipes in strict JSON schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                cuisine: { type: Type.STRING },
                category: { type: Type.STRING },
                prepTime: { type: Type.STRING },
                cookTime: { type: Type.STRING },
                totalMinutes: { type: Type.INTEGER },
                servings: { type: Type.INTEGER },
                difficulty: { type: Type.STRING },
                calories: { type: Type.INTEGER },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.NUMBER },
                      unit: { type: Type.STRING },
                      notes: { type: Type.STRING },
                    },
                    required: ['name', 'quantity', 'unit'],
                  },
                },
                instructions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      detail: { type: Type.STRING },
                      tip: { type: Type.STRING },
                      timerMinutes: { type: Type.INTEGER },
                    },
                    required: ['stepNumber', 'title', 'detail'],
                  },
                },
                videoTutorial: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    youtubeSearchUrl: { type: Type.STRING },
                    embedUrl: { type: Type.STRING },
                  },
                  required: ['title', 'youtubeSearchUrl'],
                },
                chefNote: { type: Type.STRING },
              },
              required: [
                'title',
                'description',
                'cuisine',
                'category',
                'prepTime',
                'cookTime',
                'servings',
                'difficulty',
                'ingredients',
                'instructions',
              ],
            },
          },
        });

        const text = response.text;
        if (text) {
          const recipeData = JSON.parse(text);
          return res.json({ success: true, recipe: recipeData });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to chef recipe generation:', geminiError);
      }
    }

    // Fallback if API key is not yet set or model is unavailable
    const fallbackRecipe = {
      title: prompt ? `Chef's Special: ${prompt.slice(0, 35)}` : 'Caramelized Leek & Wild Mushroom Risotto',
      description: 'A luxurious arborio rice dish slowly simmered in rich thyme broth, enriched with sweet browned leeks, golden chanterelles, and aged Parmigiano-Reggiano.',
      cuisine: cuisine || 'Italian',
      category: 'Dinner',
      prepTime: '15 mins',
      cookTime: '30 mins',
      totalMinutes: 45,
      servings: 4,
      difficulty: 'Intermediate',
      calories: 480,
      tags: ['Comfort Food', 'Vegetarian', 'Gluten-Free', 'Date Night'],
      ingredients: [
        { name: 'Carnaroli or Arborio rice', quantity: 300, unit: 'g', notes: 'do not rinse' },
        { name: 'Vegetable or chicken broth', quantity: 1.2, unit: 'L', notes: 'kept at a gentle simmer' },
        { name: 'Mixed wild mushrooms', quantity: 350, unit: 'g', notes: 'sliced' },
        { name: 'Leek (white and pale green parts)', quantity: 2, unit: 'pieces', notes: 'thinly sliced' },
        { name: 'Dry white wine', quantity: 120, unit: 'ml', notes: 'Pinot Grigio or Sauvignon Blanc' },
        { name: 'Parmigiano-Reggiano', quantity: 60, unit: 'g', notes: 'finely grated' },
        { name: 'Unsalted butter', quantity: 45, unit: 'g', notes: 'cubed cold' },
        { name: 'Extra virgin olive oil', quantity: 2, unit: 'tbsp', notes: '' },
        { name: 'Fresh thyme leaves', quantity: 1, unit: 'tbsp', notes: '' },
        { name: 'Sea salt and cracked black pepper', quantity: 1, unit: 'tsp', notes: 'to taste' },
      ],
      instructions: [
        {
          stepNumber: 1,
          title: 'Sauté Mushrooms',
          detail: 'Heat olive oil in a wide heavy skillet over high heat. Add the mushrooms in a single layer and sear without stirring for 3 minutes until deeply golden. Season with salt, pepper, and fresh thyme, then transfer to a plate.',
          tip: 'Do not salt the mushrooms until they develop a golden crust, otherwise they will steam instead of caramelizing.',
          timerMinutes: 6,
        },
        {
          stepNumber: 2,
          title: 'Sweat Leeks & Toast Rice',
          detail: 'Melt 15g butter in the same pan over medium-low heat. Add sliced leeks and cook gently for 5 minutes until soft and fragrant. Add the rice and stir continuously for 2 minutes to toast each grain until edges turn translucent.',
          tip: 'Toasting the starch barrier on the grain prevents the risotto from becoming mushy.',
          timerMinutes: 7,
        },
        {
          stepNumber: 3,
          title: 'Deglaze & Simmer Broth',
          detail: 'Pour in the white wine and stir until completely absorbed by the rice. Begin ladling hot broth 1 cup at a time, stirring steadily. Only add the next ladle once the liquid has almost been absorbed.',
          tip: 'Keep the stock pot simmering on the back burner so cold broth never stalls the cooking.',
          timerMinutes: 18,
        },
        {
          stepNumber: 4,
          title: 'The Mantecatura Finish',
          detail: 'When rice is al dente, remove from heat. Vigorously beat in the cold cubed butter, grated Parmigiano-Reggiano, and sautéed mushrooms. Cover for 2 minutes before serving on warm plates.',
          tip: 'The Italian technique of mantecatura creates an unctuous emulsion that gives risotto its iconic wave (all\'onda).',
          timerMinutes: 2,
        },
      ],
      videoTutorial: {
        title: 'Masterclass: How to Cook Perfect Risotto with Chef Gordon Ramsay',
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=how+to+make+authentic+mushroom+risotto+masterclass',
        embedUrl: 'https://www.youtube.com/embed/NKHMh6k1F_s',
      },
      chefNote: 'For the ultimate texture, maintain a steady simmer and always serve immediately while the center is tender yet firm to the bite.',
    };

    return res.json({ success: true, recipe: fallbackRecipe });
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate recipe recommendation',
    });
  }
});

// Community recipe requests endpoint
app.get('/api/recipe-requests', (_req, res) => {
  res.json({ success: true, requests: communityRequests });
});

app.post('/api/recipe-requests', (req, res) => {
  const { dishName, cuisine, notes, requestedBy } = req.body;
  if (!dishName) {
    return res.status(400).json({ error: 'Dish name is required' });
  }

  const newRequest: RecipeRequest = {
    id: `req-${Date.now()}`,
    dishName: dishName.trim(),
    cuisine: cuisine?.trim() || 'General',
    notes: notes?.trim() || 'Community requested dish',
    requestedBy: requestedBy?.trim() || 'Home Cook',
    votes: 1,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'In Development',
  };

  communityRequests.unshift(newRequest);
  res.status(201).json({ success: true, request: newRequest });
});

app.post('/api/recipe-requests/:id/vote', (req, res) => {
  const { id } = req.params;
  const item = communityRequests.find((r) => r.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Request not found' });
  }
  item.votes += 1;
  res.json({ success: true, votes: item.votes });
});

// Dev vs Prod Vite Integration
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const distIndexPath = path.join(distPath, 'index.html');
  const hasDist = fs.existsSync(distIndexPath);
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (hasDist && process.env.NODE_ENV !== 'development');

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev middleware failed, serving static dist build:', err);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(distIndexPath);
        });
      }
    }
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(distIndexPath);
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });

  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

startServer();
