const KANAL = 'discord';

async function notifieraDiscord(meddelande) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        return;
    }

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: meddelande
        })
    });

    if (!response.ok) {
        throw new Error(`Discord webhook failed: ${response.status}`);
    }
}

async function skickaMail(meddelande, rubrik) {
    // kanske göra det sen om vi har tid
}

async function notifiera(meddelande, rubrik) {
    try {
        if (KANAL === 'discord') {
            await notifieraDiscord(meddelande);
        } else {
            await skickaMail(meddelande, rubrik);
        }
    } catch (error) {
        console.error('Notifiering misslyckades:', error.message);
    }
}

export default notifiera;
