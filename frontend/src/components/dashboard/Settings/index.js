import { useEffect, useState } from "react";
import styles from "../../../../styles/Home.module.css";
import { Text, Accordion, Grid, Group, ActionIcon, Flex, Container, Modal, TextInput, Button } from "@mantine/core";
import { IconPlus, IconDots } from '@tabler/icons';
import ServerSetting from "./_serverSetting";
import { useForm } from '@mantine/form';

function NewServerModal({ closeModal }) {
    const createNewServer = ((data) => {
        fetch("/api/servers/settings", {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        })
            .then((resp) => resp.json())
            .then((json) => {
                console.log(json);
                closeModal();
            })
            .catch((e) => console.error(e))
    })

    const form = useForm({
        initialValues: {
            name: '',
            provider: '',
            url: '',
            api_url: '',
            webhook_url: ''
        },
        validate: {

        }
    });

    return (
        <form onSubmit={form.onSubmit((values) => createNewServer(values))}>
            <Grid>
                <Grid.Col span={6}>
                    <TextInput
                        placeholder="Server Name"
                        variant="filled"
                        radius="md"
                        withAsterisk
                        required
                        data-autofocus
                        {...form.getInputProps('name')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        placeholder="Provider"
                        variant="filled"
                        radius="md"
                        {...form.getInputProps('provider')}
                    />
                </Grid.Col>

                <Grid.Col>
                    <TextInput
                        placeholder="Frontend URL"
                        variant="filled"
                        radius="md"
                        withAsterisk
                        required
                        {...form.getInputProps('url')}
                    />
                </Grid.Col>

                <Grid.Col>
                    <TextInput
                        placeholder="API URL"
                        variant="filled"
                        radius="md"
                        {...form.getInputProps('api_ping_url')}
                    />
                </Grid.Col>

                <Grid.Col>
                    <TextInput
                        placeholder="Webhook URL"
                        variant="filled"
                        radius="md"
                        {...form.getInputProps('webhook_url')}
                    />
                </Grid.Col>
            </Grid>

            <Button type="submit" sx={(theme) => ({
                marginTop: theme.spacing.md,
                float: 'right'
            })} >ADD</Button>
        </form>
    );
}

export function DashboardSettings() {
    const [newServerModalOpened, setNewServerModalOpened] = useState(false);
    const [servers, setServers] = useState([]);

    const fetchServers = (() => {
        fetch('/api/servers/settings')
            .then((resp) => resp.json())
            .then((json) => setServers(json.results))
            .catch((e) => console.error(e))
    })

    useEffect(() => {
        fetchServers()
    }, [])

    const openNewServerModal = (() => {
        setNewServerModalOpened(true);
    })

    const onCloseNewServerModal = (() => {
        setNewServerModalOpened(false);
        fetchServers();
    })

    return (
        <Container>
            <Modal
                opened={newServerModalOpened}
                onClose={onCloseNewServerModal}
                title="Add Server"
                centered
            >
                <NewServerModal closeModal={() => onCloseNewServerModal()} />
            </Modal>

            <Group position="apart">
                <Text size="36px" weight={900}>SERVERS</Text>
                <ActionIcon onClick={openNewServerModal}><IconPlus /></ActionIcon>
            </Group>

            <Accordion variant="separated" radius="lg">
                {servers.map((server) => {
                    return <ServerSetting server={server} key={server.id}/>
                })}
            </Accordion>
        </Container>
    )
}
