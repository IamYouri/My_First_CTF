app.get('/start_challenge', async (req, res) => {
    const { user_id, challenge_id } = req.query;

    try {
        // Vérifier les challenges précédemment résolus par l'utilisateur
        const unresolvedCTFs = await pool.query(`
            SELECT * FROM ctfs WHERE id < $1 AND id NOT IN (
                SELECT ctf_id FROM resolved_ctfs WHERE user_id = $2
            )
        `, [challenge_id, user_id]);

        if (unresolvedCTFs.rows.length > 0) {
            return res.status(403).json({ error: 'Vous devez résoudre les CTFs précédents avant d\'accéder à celui-ci.' });
        }

        // Lancer le conteneur Docker
        const container = await docker.createContainer({
            Image: 'challenges-image',
            name: `challenge_${user_id}_${Date.now()}`,
            ExposedPorts: {
                '5000/tcp': {},
                '22/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '5000/tcp': [{ HostPort: '0' }],
                    '22/tcp': [{ HostPort: '0' }]
                }
            }
        });

        await container.start();
        const data = await container.inspect();

        const port5000 = data.NetworkSettings.Ports['5000/tcp'][0].HostPort;
        const port22 = data.NetworkSettings.Ports['22/tcp'][0].HostPort;

        res.json({
            container_id: container.id,
            challenge_urls: {
                app_url: `http://localhost:${port5000}`,
                ssh_url: `ssh ctfuser@localhost -p ${port22}`
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
