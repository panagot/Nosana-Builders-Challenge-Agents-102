# 🚀 Deploy MediTech AI to Nosana Network

## Prerequisites
- Docker Desktop installed
- Docker Hub account
- Nosana API key (you have: nos_CIi0RlaDAlqCKQSEXpRNGrn7lcRZ2tfhV5Nj4iPSEwg)

## Step 1: Build Docker Container

```bash
# Build the Docker image
docker build -t panagot/meditech-ai:latest .

# Login to Docker Hub (create account at hub.docker.com if needed)
docker login

# Push to Docker Hub
docker push panagot/meditech-ai:latest
```

## Step 2: Deploy to Nosana Network

### Option A: Using Nosana CLI
```bash
# Set your API key
export NOSANA_API_KEY="nos_CIi0RlaDAlqCKQSEXpRNGrn7lcRZ2tfhV5Nj4iPSEwg"

# Deploy with cheaper GPU (RTX 3060 - $0.048/h)
nosana job post --file ./nos_job_def/nosana_mastra_job_definition.json --market nvidia-3060 --timeout 10
```

### Option B: Using Nosana Dashboard
1. Go to [Nosana Dashboard](https://dashboard.nos.ci/)
2. Click "Expand" to open job definition editor
3. Copy and paste the content of `nos_job_def/nosana_mastra_job_definition.json`
4. Select GPU (RTX 3060 recommended for cost)
5. Click "Deploy"

## Step 3: Get Free Credits

### Try these credit codes in Nosana Dashboard:
- `WELCOME` - Welcome bonus
- `NEWUSER` - New user credits
- `BUILDERS2024` - Builders challenge credits
- `FREETRIAL` - Free trial credits

### Alternative: Get Free SOL
1. Join [Nosana Discord](https://discord.gg/nosana)
2. Look for #faucet or #credits channels
3. Ask for free credits for Builders Challenge

## Step 4: What You'll Get

After successful deployment:
- **Nosana Network URL** - Your agent running on decentralized compute
- **GPU Resources** - RTX 3060 with 8GB VRAM
- **Ollama Integration** - Qwen3:8b model for medical analysis
- **Complete Stack** - Mastra agent + Next.js frontend + MCP server

## Step 5: Test Your Deployed Agent

1. **Access the URL** provided by Nosana
2. **Test medical queries**:
   - "I have a headache and nausea"
   - "Chest pain with shortness of breath"
   - "Fever and fatigue for 3 days"
3. **Record video demo** (1-3 minutes)
4. **Submit to challenge**

## Troubleshooting

### If you get "Minimum of 0.005 SOL needed":
1. **Get free SOL** from Solana faucets
2. **Use Nosana Dashboard** instead of CLI
3. **Check for free credits** in dashboard
4. **Join Discord** for help

### If Docker build fails:
1. **Install Docker Desktop**
2. **Create Docker Hub account**
3. **Check Docker is running**

## Success! 🎉

Your MediTech AI Healthcare Agent will be running on Nosana's decentralized network with:
- ✅ **Real AI Agent** - Using Qwen3:8b model
- ✅ **Medical Tools** - Symptom analysis, risk assessment, treatment planning
- ✅ **Interactive Frontend** - Next.js interface
- ✅ **MCP Server** - Model Context Protocol
- ✅ **Nosana Network** - Decentralized compute

**Ready to deploy? Start with Step 1!** 🚀


