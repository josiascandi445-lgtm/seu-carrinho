import { Suspense, useCallback, useMemo, useRef } from 'react';
import { BottomNavigation } from '../components/BottomNavigation/BottomNavigation';
import { LoadingScreen } from '../components/LoadingScreen/LoadingScreen';
import { useNavigation, useNavigationState } from './NavigationContext';
import { ScreenContext } from './ScreenContext';
import { useEdgeSwipeBack } from './useEdgeSwipeBack';
import { routes } from './routes';
import { TABS, TAB_IDS } from './tabs';
import { haptics } from '../services/haptics';
import styles from './Navigator.module.css';

const lastActiveIndex = (stack) => {
  for (let i = stack.length - 1; i >= 0; i -= 1) if (!stack[i].leaving) return i;
  return 0;
};

function Frame({ stack, entry, index, tabActive }) {
  const route = routes[entry.name];
  const isTop = index === lastActiveIndex(stack);
  const visible = isTop || Boolean(entry.anim);
  const focused = tabActive && isTop;
  const tabBar = route.tabBar !== false;

  const context = useMemo(
    () => ({ focused, tabBar, name: entry.name, params: entry.params }),
    [focused, tabBar, entry.name, entry.params],
  );
  const Page = route.component;

  return (
    <div className={styles.frame} data-anim={entry.anim ?? undefined} data-visible={visible}>
      <ScreenContext.Provider value={context}>
        <Suspense fallback={<LoadingScreen inline />}>
          <Page params={entry.params} />
        </Suspense>
      </ScreenContext.Provider>
    </div>
  );
}

export function Navigator({ badges = {} }) {
  const { state } = useNavigationState();
  const navigation = useNavigation();
  const rootRef = useRef(null);

  const activeStack = state.stacks[state.activeTab];
  const top = activeStack[lastActiveIndex(activeStack)];
  const tabBarVisible = routes[top.name]?.tabBar !== false;

  useEdgeSwipeBack(rootRef, navigation.pop, navigation.canGoBack);

  const { setTab } = navigation;
  const handleTabChange = useCallback(
    (id) => {
      haptics.tap();
      setTab(id);
    },
    [setTab],
  );

  return (
    <div className={styles.root} ref={rootRef}>
      {TAB_IDS.map((tab) => {
        const stack = state.stacks[tab];
        const active = tab === state.activeTab;
        return (
          <div key={tab} className={styles.layer} data-active={active} inert={!active}>
            {stack.map((entry, index) => (
              <Frame key={entry.key} stack={stack} entry={entry} index={index} tabActive={active} />
            ))}
          </div>
        );
      })}
      <BottomNavigation
        items={TABS}
        activeId={state.activeTab}
        onChange={handleTabChange}
        badges={badges}
        hidden={!tabBarVisible}
      />
    </div>
  );
}
