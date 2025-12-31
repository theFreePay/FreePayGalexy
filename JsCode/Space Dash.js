const _supabase = window.supabase.createClient(
    'https://nomuylulsjtwjoinrxmr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbXV5bHVsc2p0d2pvaW5yeG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzgwOTgsImV4cCI6MjA2MTI1NDA5OH0.9Vgp9y1EQkbH2GooJgUmXjW4NEA-WY8keL4P5S1tiIc'
);
const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe?.user;

if (!user) {
    window.location.href = "https://t.me/TheFreePayBot?start=true";
}



const a = user.id;

async function telUserFinder() {

    const { data2, error2 } = await _supabase
        .from('telusersinfo')
        .upsert({
            id: user.id,
            name: user.first_name,
            username: user.username,
            premium: user.is_premium,

        },
            { onConflict: ['id'] }
        )
        .select()


    let { data: telusersinfo1, error } = await _supabase
        .from('telusersinfo')
        .select('*')
        .eq('id', a)
    console.log(telusersinfo1[0]);

    var typed = new Typed('#H2Viewer', {
        strings: [`<h2>Your Best Score: <i style="color:white;">${telusersinfo1[0].Score}</i> </h2>`],
        typeSpeed: 50,
    });
    setTimeout(() => {
        var typed = new Typed('#H3Viewer', {
            strings: [`<i>Play, earn coins, and win <span style="color: white !important;">Telegram gifts</span>!🎮</i>`,],
            typeSpeed: 50,
        });
    }, 3000)



    document.getElementById('HomeBtn').addEventListener('click', () => {
        window.location.href = 'https://t.me/TheFreePayBot/FreePayShop';
    })








    setTimeout(() => {
        document.getElementById('StartGameBtn').style.transform = 'translateY(50px)';
        setTimeout(() => {
            document.getElementById('StartGameBtn').style.transform = 'translateY(25px)';
            setTimeout(() => {
                document.getElementById('StartGameBtn').style.transform = 'translateY(0px)';

            }, 5)
        }, 50)
    }, 7000);

    document.getElementById('TryAgainBtn').onclick = (() => {
        init();
    })

    document.getElementById('StartGameBtn').addEventListener('click', () => {
        // console.log("Ok");
        document.getElementById('HomeBtn').style.display = 'none';
        document.getElementById('FirstDiv').style.display = 'none';
        document.getElementById('ReadyP').className = 'ReadyP';
        setTimeout(() => {
            document.getElementById('ReadyP').innerText = 'Go!!';
            setTimeout(() => {
                document.getElementById('NumberDiv').style.display = 'none';
                init();
                setTimeout(() => {
                    document.getElementById('claimBtn').style.pointerEvents = 'all';

                }, 100)

            }, 500)
        }, 2000)

    })




    // Game settings
    const c = document.getElementById('game');
    const ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    // Game variables
    let player = {
        x: 100,
        y: c.height / 2,
        size: 20,
        speed: 5,
        color: '#00ffff',
        isAlive: true,
        isPlayer: true,
        label: "YOU"
    };

    let stars = [], enemies = [], bots = [], score = 0, gameActive = true;
    let coins = 0.00;
    let gameSpeed = 1.0;
    let frames = 0;
    const keys = {};

    // Screen Shake variables
    let screenShake = {
        active: false,
        intensity: 0,
        duration: 0,
        originalX: 0,
        originalY: 0
    };

    // Shockwaves array for explosion effects
    let shockwaves = [];

    // Theme System
    let currentTheme = 'classic';
    let currentThemeLevel = 0;
    let lastMilestoneScore = 0;

    // Themes database
    const themes = {
        classic: {
            name: "CLASSIC SPACE",
            background: 'linear-gradient(to bottom, #000 0%, #0a0e29 100%)',
            playerColor: '#00ffff',
            starColor: '#ffffff',
            starGlow: false,
            enemyBaseColor: 'hsl(60, 100%, 50%)',
            enemyHueRange: 60,
            botColors: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff9900'],
            uiColor: '#00f',
            milestoneText: "CLASSIC MODE ACTIVATED!"
        },
        neon: {
            name: "NEON DREAM",
            background: 'linear-gradient(to bottom, #0a0015 0%, #1a0035 100%)',
            playerColor: '#ff00ff',
            starColor: '#00ffff',
            starGlow: true,
            starGlowColor: '#ff00ff',
            enemyBaseColor: '#00ff00',
            enemyHueRange: 120,
            botColors: ['#ff00ff', '#00ffff', '#ffff00', '#ff00aa', '#aa00ff'],
            uiColor: '#f0f',
            milestoneText: "NEON WORLD UNLOCKED! 🌈"
        },
        fire: {
            name: "INFERNO ZONE",
            background: 'linear-gradient(to bottom, #330000 0%, #660000 100%)',
            playerColor: '#ff5500',
            starColor: '#ff9900',
            starGlow: true,
            starGlowColor: '#ff3300',
            enemyBaseColor: '#ff0000',
            enemyHueRange: 30,
            botColors: ['#ff5500', '#ff9900', '#ff3300', '#ff0000', '#cc0000'],
            uiColor: '#f00',
            milestoneText: "ENTERING INFERNO ZONE! 🔥"
        },
        ice: {
            name: "FROZEN REALM",
            background: 'linear-gradient(to bottom, #001133 0%, #003366 100%)',
            playerColor: '#00ffff',
            starColor: '#aaddff',
            starGlow: true,
            starGlowColor: '#88ccff',
            enemyBaseColor: '#00aaff',
            enemyHueRange: 90,
            botColors: ['#00ffff', '#aaddff', '#88ccff', '#00aaff', '#0088ff'],
            uiColor: '#0af',
            milestoneText: "FROZEN REALM DISCOVERED! ❄️"
        },
        cyberpunk: {
            name: "CYBERPUNK 2077",
            background: 'linear-gradient(to bottom, #003322 0%, #005544 100%)',
            playerColor: '#00ff88',
            starColor: '#00ffaa',
            starGlow: true,
            starGlowColor: '#00ff66',
            enemyBaseColor: '#00cc66',
            enemyHueRange: 80,
            botColors: ['#00ff88', '#00ffaa', '#00cc66', '#00aa44', '#008833'],
            uiColor: '#0f0',
            milestoneText: "CYBERPUNK MODE ENGAGED! ⚡"
        },
        sunset: {
            name: "SUNSET PARADISE",
            background: 'linear-gradient(to bottom, #331100 0%, #663300 100%)',
            playerColor: '#ff9900',
            starColor: '#ffcc00',
            starGlow: true,
            starGlowColor: '#ffaa00',
            enemyBaseColor: '#ff6600',
            enemyHueRange: 40,
            botColors: ['#ff9900', '#ffcc00', '#ff6600', '#ff3300', '#ffaa00'],
            uiColor: '#fa0',
            milestoneText: "SUNSET PARADISE AHEAD! 🌅"
        },
        galaxy: {
            name: "DEEP GALAXY",
            background: 'linear-gradient(to bottom, #000033 0%, #330066 100%)',
            playerColor: '#aa00ff',
            starColor: '#cc88ff',
            starGlow: true,
            starGlowColor: '#aa55ff',
            enemyBaseColor: '#8800ff',
            enemyHueRange: 100,
            botColors: ['#aa00ff', '#cc88ff', '#8800ff', '#5500aa', '#220066'],
            uiColor: '#80f',
            milestoneText: "ENTERING DEEP GALAXY! 🌌"
        },
        toxic: {
            name: "TOXIC WASTELAND",
            background: 'linear-gradient(to bottom, #003300 0%, #006600 100%)',
            playerColor: '#00ff00',
            starColor: '#88ff88',
            starGlow: true,
            starGlowColor: '#44ff44',
            enemyBaseColor: '#00cc00',
            enemyHueRange: 60,
            botColors: ['#00ff00', '#88ff88', '#00cc00', '#00aa00', '#008800'],
            uiColor: '#0f0',
            milestoneText: "TOXIC ZONE DETECTED! ☢️"
        }
    };

    const themeNames = Object.keys(themes);

    // Joystick
    let joystickY = 0;
    let joystickActive = false;
    const joystickBase = document.getElementById('joystickBase');
    const joystickHandle = document.getElementById('joystickHandle');
    const shakeIndicator = document.getElementById('shakeIndicator');
    const themeIndicator = document.getElementById('themeIndicator');
    const milestoneElement = document.getElementById('milestone');

    // UI Elements
    const claimBtn = document.getElementById('claimBtn');
    const claimAmount = document.getElementById('claimAmount');
    const winScreen = document.getElementById('winScreen');
    const loseScreen = document.getElementById('loseScreen');
    const speedValue = document.getElementById('speedValue');
    const botCount = document.getElementById('botCount');


    // Helper functions
    function getRandomColorFromTheme() {
        const theme = themes[currentTheme];
        return theme.botColors[Math.floor(Math.random() * theme.botColors.length)];
    }


    // function getRandomName() {
    //      names = [];
    //     return names[Math.floor(Math.random() * names.length)];
    // }

    // THEME MANAGEMENT FUNCTIONS
    function applyTheme(themeName) {
        currentTheme = themeName;
        const theme = themes[themeName];

        // Apply background with transition
        c.style.background = theme.background;

        // Update player color
        player.color = theme.playerColor;

        // Update UI colors
        document.querySelector('.score').style.textShadow = `0 0 10px ${theme.uiColor}`;
        document.querySelector('.speed-indicator').style.textShadow = `0 0 8px ${theme.uiColor}`;
        document.querySelector('.speed-indicator').style.borderColor = theme.uiColor;
        document.querySelector('.theme-indicator').style.borderColor = theme.uiColor;
        document.querySelector('.theme-indicator').style.textShadow = `0 0 5px ${theme.uiColor}`;

        // Update claim button based on theme
        if (themeName === 'fire') {
            claimBtn.style.background = 'linear-gradient(45deg, #ff5500, #ff3300)';
            claimBtn.style.boxShadow = '0 0 15px #ff5500';
        } else if (themeName === 'ice') {
            claimBtn.style.background = 'linear-gradient(45deg, #00aaff, #0088ff)';
            claimBtn.style.boxShadow = '0 0 15px #00aaff';
        } else if (themeName === 'neon') {
            claimBtn.style.background = 'linear-gradient(45deg, #ff00ff, #aa00ff)';
            claimBtn.style.boxShadow = '0 0 15px #ff00ff';
        } else {
            claimBtn.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
            claimBtn.style.boxShadow = '0 0 15px #00ff88';
        }

        // Update milestone element
        milestoneElement.style.borderColor = theme.uiColor;
        milestoneElement.style.boxShadow = `0 0 50px ${theme.uiColor}`;
        milestoneElement.style.textShadow = `0 0 20px ${theme.uiColor}`;

        // Update theme indicator
        document.getElementById('themeName').textContent = theme.name;
        themeIndicator.style.opacity = '1';

        // Hide theme indicator after 3 seconds
        setTimeout(() => {
            themeIndicator.style.opacity = '0';
        }, 3000);
    }

    function showMilestone(message) {
        milestoneElement.textContent = message;
        milestoneElement.style.display = 'block';
        milestoneElement.style.animation = 'milestoneAnimation 3s forwards';

        // Hide after animation
        setTimeout(() => {
            milestoneElement.style.display = 'none';
            milestoneElement.style.animation = '';
        }, 3000);
    }

    function checkThemeChange() {
        const milestone = Math.floor(score / 1000);

        if (milestone > currentThemeLevel) {
            currentThemeLevel = milestone;

            // Randomly select a new theme (different from current)
            let newTheme;
            do {
                newTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
            } while (newTheme === currentTheme && themeNames.length > 1);

            // Apply new theme
            applyTheme(newTheme);

            // Show milestone announcement
            showMilestone(themes[newTheme].milestoneText);

            // Create celebration effect
            createThemeChangeEffect();

            return true;
        }
        return false;
    }

    function createThemeChangeEffect() {
        // Create sparkle effect
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 300 + 100;
            const x = player.x + Math.cos(angle) * distance;
            const y = player.y + Math.sin(angle) * distance;
            const size = Math.random() * 10 + 5;
            const color = themes[currentTheme].botColors[Math.floor(Math.random() * themes[currentTheme].botColors.length)];

            // Create particle
            createThemeParticle(x, y, size, color);
        }

        // Create screen flash
        c.style.filter = 'brightness(2)';
        setTimeout(() => {
            c.style.filter = 'brightness(1)';
        }, 200);
    }

    function createThemeParticle(x, y, size, color) {
        // Create a simple particle animation
        const particle = {
            x: x,
            y: y,
            size: size,
            color: color,
            alpha: 1,
            velocity: {
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10
            },
            life: 60
        };

        // Animate particle
        function animateParticle() {
            if (particle.life <= 0) return;

            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.alpha = particle.life / 60;
            particle.size *= 0.95;
            particle.life--;

            // Draw particle
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (particle.life > 0) {
                requestAnimationFrame(animateParticle);
            }
        }

        animateParticle();
    }

    // SCREEN SHAKE FUNCTIONS
    function createScreenShake(intensity = 5, duration = 15) {
        screenShake.active = true;
        screenShake.intensity = intensity;
        screenShake.duration = duration;

        // Show shake indicator
        shakeIndicator.style.display = 'block';
        setTimeout(() => {
            shakeIndicator.style.display = 'none';
        }, 1000);
    }

    function updateScreenShake() {
        if (!screenShake.active) return;

        if (screenShake.duration > 0) {
            const shakeX = (Math.random() - 0.5) * screenShake.intensity * 2;
            const shakeY = (Math.random() - 0.5) * screenShake.intensity * 2;

            c.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            const blurAmount = Math.min(screenShake.intensity * 0.3, 3);
            c.style.filter = `blur(${blurAmount}px)`;

            screenShake.intensity *= 0.85;
            screenShake.duration--;

            if (screenShake.intensity < 0.5) {
                screenShake.duration = 0;
            }
        } else {
            c.style.transform = 'translate(0px, 0px)';
            c.style.filter = 'blur(0px)';
            screenShake.active = false;
        }
    }

    // SHOCKWAVE FUNCTIONS
    function createShockwave(x, y, color = '#ff5500', sizeMultiplier = 1) {
        shockwaves.push({
            x: x,
            y: y,
            radius: 10,
            maxRadius: 50 + (30 * sizeMultiplier),
            color: color,
            alpha: 0.9,
            lineWidth: 2 + sizeMultiplier,
            speed: 2 + sizeMultiplier
        });
    }

    function updateShockwaves() {
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const wave = shockwaves[i];
            wave.radius += wave.speed;
            wave.alpha *= 0.93;

            if (wave.radius >= wave.maxRadius || wave.alpha <= 0.05) {
                shockwaves.splice(i, 1);
            }
        }
    }

    function drawShockwaves() {
        shockwaves.forEach(wave => {
            ctx.strokeStyle = wave.color;
            ctx.globalAlpha = wave.alpha;
            ctx.lineWidth = wave.lineWidth;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.globalAlpha = wave.alpha * 0.5;
            ctx.lineWidth = wave.lineWidth * 0.5;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius - 3, 0, Math.PI * 2);
            ctx.stroke();

            ctx.globalAlpha = 1.0;
        });
    }

    // Controls
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    // Setup joystick
    function setupJoystick() {
        joystickBase.addEventListener('touchstart', handleJoystickStart);
        joystickBase.addEventListener('mousedown', handleJoystickStart);

        document.addEventListener('touchmove', handleJoystickMove);
        document.addEventListener('mousemove', handleJoystickMove);

        document.addEventListener('touchend', handleJoystickEnd);
        document.addEventListener('mouseup', handleJoystickEnd);
    }

    function handleJoystickStart(e) {
        joystickActive = true;
        updateJoystick(e);
        e.preventDefault();
    }

    function handleJoystickMove(e) {
        if (!joystickActive) return;
        updateJoystick(e);
    }

    function handleJoystickEnd() {
        joystickActive = false;
        joystickY = 0;
        joystickHandle.style.transform = 'translate(-50%, -50%)';
    }

    function updateJoystick(e) {
        const rect = joystickBase.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;

        let clientY;
        if (e.touches) {
            clientY = e.touches[0].clientY;
        } else {
            clientY = e.clientY;
        }

        let dy = clientY - centerY;
        const maxMove = rect.height / 2 - 28;

        dy = Math.max(-maxMove, Math.min(maxMove, dy));
        joystickY = dy / maxMove;
        joystickHandle.style.transform = `translate(-50%, ${dy}px)`;
    }

    // Create stars based on current theme
    function createStars() {
        stars = [];
        const theme = themes[currentTheme];

        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * c.width,
                y: Math.random() * c.height,
                size: Math.random() * 4 + 1,
                speed: Math.random() * 3 + 1,
                color: theme.starColor,
                glow: theme.starGlow,
                glowColor: theme.starGlowColor,
                twinkle: Math.random() > 0.7,
                twinkleSpeed: Math.random() * 0.05 + 0.02,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }

    // Update stars animation
    function updateStars() {
        const theme = themes[currentTheme];

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.x -= s.speed * gameSpeed;

            if (s.x < 0) {
                s.x = c.width;
                s.y = Math.random() * c.height;
            }

            // Update twinkle
            if (s.twinkle) {
                s.twinklePhase += s.twinkleSpeed;
            }
        }
    }

    // Create enemy based on current theme
    function createEnemy() {
        const theme = themes[currentTheme];

        // Random enemy shape (circle, square, triangle)
        const shapes = ['circle', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        // Random size based on theme
        const size = Math.random() * 10 + 10;

        // Random color based on theme
        const hue = Math.random() * theme.enemyHueRange;
        const color = `hsl(${hue}, 100%, 50%)`;

        enemies.push({
            x: c.width,
            y: Math.random() * c.height,
            size: size,
            speed: Math.random() * 4 + 2,
            color: color,
            shape: shape,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            glow: true,
            glowColor: color
        });
    }
    // Create bot ships based on current theme
    function createBot() {
        let names = [];


        async function getRandomName() {

            let { data: telusersinfo, error } = await _supabase
                .from('telusersinfo')
                .select('name')

            for (let ii = 0; ii < telusersinfo.length; ii++) {

                user = telusersinfo[ii];
                let UsersFinder = telusersinfo[ii].name;
                names.push(UsersFinder);
            }
            // console.log(names);
            // return names[Math.floor(Math.random() * names.length)];

            function rrr() {
                return names = names[Math.floor(Math.random() * names.length)]

            }


            // console.log(names.Name);
            const botTypes = ['Silver', 'Golden', 'Diamond', 'Vip'];
            const type = botTypes[Math.floor(Math.random() * botTypes.length)];

            const theme = themes[currentTheme];

            const newBot = {
                x: Math.random() * (c.width - 300) + 150,
                y: Math.random() * (c.height - 100) + 50,
                size: 15 + Math.random() * 10,
                speed: 1 + Math.random() * 1.5,
                color: getRandomColorFromTheme(),
                isAlive: true,
                isPlayer: false,
                label: rrr(),
                direction: Math.random() > 0.5 ? 1 : -1,
                moveCounter: 0,
                movePattern: Math.floor(Math.random() * 3),
                avoidanceTimer: 0,
                avoiding: false,
                avoidDirection: { x: 0, y: 0 },
                type: type,
                themeColor: theme.playerColor
            };

            // Adjust bot properties based on type
            if (type === 'Silver') {
                newBot.size *= 1.5;
                newBot.speed *= 0.7;
                newBot.label = newBot.label;
            } else if (type === 'Golden') {
                newBot.size *= 0.8;
                newBot.speed *= 1.8;
                newBot.label = newBot.label;
            } else if (type === 'Diamond') {
                newBot.size *= 0.9;
                newBot.speed *= 1.9;
                newBot.label = newBot.label;
            }

            const dx = newBot.x - player.x;
            const dy = newBot.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 100) {
                bots.push(newBot);
                updateBotCounter();
            }
        } getRandomName()
    }

    // Update bot counter
    function updateBotCounter() {
        botCount.textContent = bots.filter(b => b.isAlive).length;
    }

    // Update game speed
    function updateGameSpeed() {
        frames++;

        if (frames % 300 === 0 && gameSpeed < 3.0) {
            gameSpeed += 0.1;
            speedValue.textContent = gameSpeed.toFixed(1) + 'x';
            speedValue.style.color = '#ff0';
            setTimeout(() => speedValue.style.color = '#0ff', 300);
        }

        if (frames % 300 === 0 && bots.length < 3 && Math.random() < 0.2) {
            createBot();
        }
    }

    // Update claim button
    function updateClaimButton() {
        coins += 0.01;
        const formattedCoins = coins.toFixed(2);
        claimAmount.textContent = `${formattedCoins} Coins`;

        if (coins >= 10.00) {
            claimBtn.style.background = 'linear-gradient(45deg, #ffd700, #ffaa00)';
            claimBtn.style.boxShadow = '0 0 20px #ffd700';
        } else if (coins >= 5.00) {
            claimBtn.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
            claimBtn.style.boxShadow = '0 0 15px #00ff88';
        } else {
            claimBtn.style.background = 'linear-gradient(45deg, #00ccff, #0088ff)';
            claimBtn.style.boxShadow = '0 0 12px #00ccff';
        }
    }

    // Click on claim button
    claimBtn.addEventListener('click', function () {
        document.getElementById('HomeBtn').style.display = 'flex';

        if (gameActive && player.isAlive) {
            gameActive = false;
            winScreen.style.display = 'block';
            document.getElementById('winCoins').textContent = `${coins.toFixed(2)} Coins`;
            cancelAnimationFrame(animationId);
        }
        document.getElementById('ClaimCoinAndScore').style.pointerEvents = 'all';

        document.getElementById('ClaimCoinAndScore').onclick = (() => {
            document.getElementById('ClaimCoinAndScore').style.pointerEvents = 'none';
            async function UpdaitingScoreAndCoin() {

                let { data: telusersinfo, error1 } = await _supabase
                    .from('telusersinfo')
                    .select('*')
                    .eq('id', a)

                let NowOk = Number(telusersinfo[0].point);
                let NowPoint = Number(coins.toFixed(2));
                let OkCoin = NowOk += NowPoint;

                let NowOkScore = Number(telusersinfo[0].Score);
                let NowScore = Number(score);

                if (NowOkScore < NowScore) {
                    NowOkScore = NowScore;
                }

                const { data, error } = await _supabase
                    .from('telusersinfo')
                    .update({ Score: `${NowOkScore}`, point: `${OkCoin}` })
                    .eq('id', a)
                    .select()

            } UpdaitingScoreAndCoin().then(() => {
                console.log("Ok");
                Swal.fire({
                    title: "claiming",
                    icon: "success",
                    draggable: true
                });
                document.getElementById('ClaimCoinAndScore').style.pointerEvents = 'all';

                document.getElementById('ClaimCoinAndScore').innerText = 'Restart';
                document.getElementById('ClaimCoinAndScore').onclick = (() => {
                    init();
                });
            });

        });

    });

    // Create explosion with screen shake
    function createExplosion(x, y, color = '#ff5500', sizeMultiplier = 1) {
        // Create particles
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            const size = Math.random() * 8 + 3;

            ctx.fillStyle = color;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(x + Math.cos(angle) * speed * 2, y + Math.sin(angle) * speed * 2, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        // Create shockwave
        createShockwave(x, y, color, sizeMultiplier);
    }

    // Game over
    function gameOver() {
        if (!player.isAlive) return;
        player.isAlive = false;
        gameActive = false;

        createScreenShake(12, 25);
        createExplosion(player.x, player.y, player.color, 2);

        setTimeout(() => {
            loseScreen.style.display = 'block';
            document.getElementById('loseScore').textContent = score;
            cancelAnimationFrame(animationId);
            document.getElementById('HomeBtn').style.display = 'flex';
            AdController.show().then((result) => {
                //alert("Ok"+result);
    // user watch ad till the end or close it in interstitial format
    // your code to reward user for rewarded format
}).catch((result) => {
                
               // alert(result);
    // user get error during playing ad
    // do nothing or whatever you want
})

        }, 800);


    }

    // Update bots AI
    function updateBots() {
        for (let i = bots.length - 1; i >= 0; i--) {
            const bot = bots[i];
            if (!bot.isAlive) {
                bots.splice(i, 1);
                updateBotCounter();
                continue;
            }

            if (frames % 10 !== 0) continue;

            bot.moveCounter++;

            // Avoid obstacles
            let avoidX = 0;
            let avoidY = 0;
            let shouldAvoid = false;

            for (const enemy of enemies) {
                const dx = bot.x - enemy.x;
                const dy = bot.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const safeDistance = bot.size + enemy.size + 80;

                if (distance < safeDistance) {
                    shouldAvoid = true;
                    const force = (safeDistance - distance) / safeDistance;
                    avoidX += (dx / distance) * force * 2.5;
                    avoidY += (dy / distance) * force * 2.5;
                }
            }

            if (shouldAvoid) {
                bot.avoiding = true;
                bot.avoidanceTimer = 3;

                bot.x += avoidX * bot.speed * 2.3;
                bot.y += avoidY * bot.speed * 0.3;
            } else if (bot.avoiding) {
                bot.avoidanceTimer--;
                if (bot.avoidanceTimer <= 0) {
                    bot.avoiding = false;
                }
            } else {
                if (bot.movePattern === 0) {
                    bot.y += Math.sin(bot.moveCounter * 0.02) * bot.speed * 0.3;
                } else if (bot.movePattern === 1) {
                    if (bot.moveCounter % 50 === 0) {
                        bot.direction = Math.random() > 0.5 ? 1 : -1;
                    }
                    bot.x += bot.direction * bot.speed * 2.2;
                } else {
                    bot.x += Math.cos(bot.moveCounter * 0.03) * bot.speed * 0.5;
                    bot.y += Math.sin(bot.moveCounter * 0.03) * bot.speed * 0.5;
                }
            }

            bot.x = Math.max(30, Math.min(c.width - 30, bot.x));
            bot.y = Math.max(150, Math.min(c.height - 150, bot.y));

            // Check collision with enemies
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                const dx = bot.x - enemy.x;
                const dy = bot.y - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < bot.size + enemy.size) {
                    bot.isAlive = false;

                    let shakeIntensity;
                    let shakeDuration;

                    switch (bot.type) {
                        case 'heavy':
                            shakeIntensity = 8;
                            shakeDuration = 13;
                            break;
                        case 'fast':
                            shakeIntensity = 6;
                            shakeDuration = 12;
                            break;
                        case 'agile':
                            shakeIntensity = 5;
                            shakeDuration = 10;
                            break;
                        default:
                            shakeIntensity = Math.min(bot.size / 4, 7);
                            shakeDuration = 15;
                    }

                    createScreenShake(shakeIntensity, shakeDuration);
                    createExplosion(bot.x, bot.y, bot.color, bot.size / 25);

                    enemies.splice(j, 1);
                    updateBotCounter();
                    break;
                }
            }
        }
    }

    // Update game objects
    function update() {
        if (!gameActive || !player.isAlive) return;

        updateGameSpeed();
        updateShockwaves();
        updateStars();

        // Check for theme change every 1000 points
        checkThemeChange();

        if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
        if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
        if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
        if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

        player.y += joystickY * player.speed;

        player.x = Math.max(0, Math.min(c.width, player.x));
        player.y = Math.max(0, Math.min(c.height, player.y));

        if (frames % 3 === 0) {
            updateBots();
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            e.x -= e.speed * gameSpeed;
            e.rotation += e.rotationSpeed;

            if (e.x < -50) {
                enemies.splice(i, 1);
                continue;
            }

            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < player.size + e.size) {
                gameOver();
                return;
            }
        }

        const enemyChance = 0.02 + (gameSpeed * 0.005);
        if (Math.random() < enemyChance && enemies.length < 5 + Math.floor(gameSpeed)) {
            createEnemy();
        }

        score++;
        document.getElementById('score').textContent = score;
        updateClaimButton();
    }

    // Draw stars with theme effects
    function drawStars() {
        const theme = themes[currentTheme];

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];

            // Calculate twinkle effect
            let alpha = 1;
            let size = s.size;
            if (s.twinkle) {
                alpha = 0.5 + Math.sin(s.twinklePhase) * 0.5;
                size = s.size * (0.7 + Math.sin(s.twinklePhase) * 0.3);
            }

            // Draw glow if enabled
            if (s.glow) {
                ctx.save();
                ctx.globalAlpha = alpha * 0.3;
                ctx.fillStyle = s.glowColor;
                ctx.beginPath();
                ctx.arc(s.x, s.y, size * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Draw star
            ctx.globalAlpha = alpha;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }

    // Draw enemy with shape based on theme
    function drawEnemy(enemy) {
        // Draw glow
        if (enemy.glow) {
            ctx.save();
            ctx.shadowColor = enemy.glowColor;
            ctx.shadowBlur = 20;
            ctx.fillStyle = enemy.color;

            if (enemy.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (enemy.shape === 'square') {
                ctx.save();
                ctx.translate(enemy.x, enemy.y);
                ctx.rotate(enemy.rotation);
                ctx.fillRect(-enemy.size / 2, -enemy.size / 2, enemy.size, enemy.size);
                ctx.restore();
            } else if (enemy.shape === 'triangle') {
                ctx.save();
                ctx.translate(enemy.x, enemy.y);
                ctx.rotate(enemy.rotation);
                ctx.beginPath();
                ctx.moveTo(0, -enemy.size / 2);
                ctx.lineTo(enemy.size / 2, enemy.size / 2);
                ctx.lineTo(-enemy.size / 2, enemy.size / 2);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            ctx.restore();
        }

        // Draw main shape
        ctx.fillStyle = enemy.color;

        if (enemy.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (enemy.shape === 'square') {
            ctx.save();
            ctx.translate(enemy.x, enemy.y);
            ctx.rotate(enemy.rotation);
            ctx.fillRect(-enemy.size / 2, -enemy.size / 2, enemy.size, enemy.size);
            ctx.restore();
        } else if (enemy.shape === 'triangle') {
            ctx.save();
            ctx.translate(enemy.x, enemy.y);
            ctx.rotate(enemy.rotation);
            ctx.beginPath();
            ctx.moveTo(0, -enemy.size / 2);
            ctx.lineTo(enemy.size / 2, enemy.size / 2);
            ctx.lineTo(-enemy.size / 2, enemy.size / 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // Draw ship with theme colors
    function drawShip(ship, isPlayer = false) {
        if (!ship.isAlive) return;

        const theme = themes[currentTheme];

        // Shadow
        ctx.save();
        ctx.shadowColor = ship.color;
        ctx.shadowBlur = isPlayer ? 25 : 15;
        ctx.shadowOffsetX = -12;
        ctx.fillStyle = ship.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(ship.x + ship.size, ship.y);
        ctx.lineTo(ship.x - ship.size / 2, ship.y + ship.size / 2);
        ctx.lineTo(ship.x - ship.size / 2, ship.y - ship.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Main body
        ctx.fillStyle = ship.color;
        ctx.beginPath();
        ctx.moveTo(ship.x + ship.size, ship.y);
        ctx.lineTo(ship.x - ship.size / 2, ship.y + ship.size / 2);
        ctx.lineTo(ship.x - ship.size / 2, ship.y - ship.size / 2);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = isPlayer ? '#ffffff' : '#cccccc';
        ctx.beginPath();
        ctx.arc(ship.x + ship.size / 2, ship.y, ship.size / 3, 0, Math.PI * 2);
        ctx.fill();

        // Engine
        ctx.save();
        ctx.shadowColor = isPlayer ? theme.uiColor : '#ff6600';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = -5;
        ctx.fillStyle = isPlayer ? '#f90' : '#ff3300';
        ctx.beginPath();
        ctx.arc(ship.x - ship.size, ship.y, ship.size / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Engine flame with theme color
        const flameSize = 2 + Math.sin(Date.now() * 0.01) * 2;
        ctx.fillStyle = isPlayer ? theme.uiColor : '#ff3300';
        ctx.beginPath();
        ctx.ellipse(ship.x - ship.size - 3, ship.y, flameSize, ship.size / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Label
        if (ship.label) {
            ctx.fillStyle = isPlayer ? theme.uiColor : '#ff6b6b';
            ctx.font = isPlayer ? 'bold 12px Arial' : 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 3;
            ctx.fillText(ship.label, ship.x, ship.y - ship.size - 5);
            ctx.shadowBlur = 0;
        }

        // Avoidance indicator for bots
        if (!isPlayer && ship.avoiding && ship.avoidanceTimer > 0) {
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.size + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Bot type indicator
        if (!isPlayer) {
            ctx.fillStyle =
                ship.type === 'heavy' ? '#ff5555' :
                    ship.type === 'fast' ? '#55ff55' :
                        ship.type === 'agile' ? '#5555ff' :
                            '#aaaaaa';
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(ship.type.toUpperCase(), ship.x, ship.y + ship.size + 12);
        }
    }

    // Draw game
    function draw() {
        // Clear canvas with theme-based fade
        const theme = themes[currentTheme];
        ctx.fillStyle = 'rgba(0, 0, 20, 0.3)';
        ctx.fillRect(0, 0, c.width, c.height);

        // Draw stars
        drawStars();

        // Draw shockwaves
        drawShockwaves();

        // Draw enemies
        for (let i = 0; i < enemies.length; i++) {
            drawEnemy(enemies[i]);
        }

        // Draw bots
        for (let i = 0; i < bots.length; i++) {
            drawShip(bots[i], false);
        }

        // Draw player
        if (player.isAlive) {
            drawShip(player, true);
        }
    }

    let animationId;
    let lastTime = 0;

    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = Math.min(timestamp - lastTime, 32);
        lastTime = timestamp;

        if (gameActive && player.isAlive) {
            update();
            updateScreenShake();
            draw();
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    function init() {
        player = {
            x: 100,
            y: c.height / 2,
            size: 20,
            speed: 5,
            color: '#00ffff',
            isAlive: true,
            isPlayer: true,
            label: "YOU"
        };

        stars = [];
        enemies = [];
        bots = [];
        shockwaves = [];
        score = 0;
        coins = 0.00;
        gameSpeed = 1.0;
        frames = 0;
        gameActive = true;
        lastTime = 0;

        // Reset theme
        currentTheme = 'classic';
        currentThemeLevel = 0;
        applyTheme('classic');

        // Reset screen shake
        screenShake.active = false;
        c.style.transform = 'translate(0px, 0px)';
        c.style.filter = 'blur(0px)';

        speedValue.textContent = gameSpeed.toFixed(1) + 'x';
        speedValue.style.color = '#0ff';

        winScreen.style.display = 'none';
        loseScreen.style.display = 'none';
        shakeIndicator.style.display = 'none';
        milestoneElement.style.display = 'none';

        document.getElementById('HomeBtn').style.display = 'none';
        document.getElementById('ClaimCoinAndScore').innerText = 'Claim';
        document.getElementById('score').textContent = score;
        updateClaimButton();
        updateBotCounter();

        createStars();

        const initialBots = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < initialBots; i++) {
            setTimeout(() => createBot(), i * 500);
        }

        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        animationId = requestAnimationFrame(gameLoop);
    }

    window.addEventListener('resize', () => {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        player.y = c.height / 2;
        init();
    });

    setupJoystick();
    // for play
    // init();

} telUserFinder();

