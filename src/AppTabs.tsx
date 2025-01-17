import { useState } from "react";
import { AppShell, Text, Button, Stack, ColorSchemeScript, Group, ScrollArea, Burger, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconList, IconSettings, IconChartBar, IconHistory } from "@tabler/icons-react";
import { Settings } from "./Settings";
import EntryList from "./entry/EntryList";
import TrackerManagement from "./tracker/TrackerManagement";
import { HEADER_HEIGHT, HEADER_TOP_HEIGHT } from "./constants";
import { CollectionsView } from "./home/CollectionsView";

function AppTabs() {
  const [sideBarOpened, { toggle: toggleSidebar }] = useDisclosure();
  const [activeTab, setActiveTab] = useState<string>("quickAccess");

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    toggleSidebar();
  };

  return (
    <>
      <ColorSchemeScript />
      <AppShell
        header={{ height: HEADER_HEIGHT }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !sideBarOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={sideBarOpened} onClick={toggleSidebar} hiddenFrom="sm" size="sm" />
            <Text>🐰 Hares</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Stack gap="sm">
            <Button
              leftSection={<IconPlus size={20} />}
              fullWidth
              variant={activeTab === "quickAccess" ? "filled" : "subtle"}
              onClick={() => changeTab("quickAccess")}
              justify="start"
            >
              Track
            </Button>

            <Button
              leftSection={<IconList size={20} />}
              fullWidth
              variant={activeTab === "trackerManagement" ? "filled" : "subtle"}
              onClick={() => changeTab("trackerManagement")}
              justify="start"
            >
              Trackers
            </Button>

            <Button
              leftSection={<IconHistory size={20} />}
              fullWidth
              variant={activeTab === "entries" ? "filled" : "subtle"}
              onClick={() => changeTab("entries")}
              justify="start"
            >
              Entries
            </Button>

            <Button
              leftSection={<IconChartBar size={20} />}
              fullWidth
              variant={activeTab === "stats" ? "filled" : "subtle"}
              onClick={() => changeTab("stats")}
              justify="start"
            >
              Stats
            </Button>

            <Button
              leftSection={<IconSettings size={20} />}
              fullWidth
              variant={activeTab === "settings" ? "filled" : "subtle"}
              onClick={() => changeTab("settings")}
              justify="start"
            >
              Settings
            </Button>
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>
          <ScrollArea type="never" h={`calc(100vh - ${HEADER_TOP_HEIGHT})`}>
            <Container p={0} pb={"md"}>
              {/* {activeTab === 'quickAccess' && <UnifiedManagement />} */}
              {activeTab === "quickAccess" && <CollectionsView />}
              {activeTab === "entries" && <EntryList />}
              {activeTab === "trackerManagement" && <TrackerManagement />}
              {activeTab === "settings" && <Settings />}
            </Container>
          </ScrollArea>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default AppTabs;
