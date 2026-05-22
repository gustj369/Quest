import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useQuests } from './hooks/useQuests.js'
import { useCharacter } from './hooks/useCharacter.js'
import { useAuth } from './hooks/useAuth.js'
import TabBar from './components/TabBar.jsx'
import LevelUpModal from './components/LevelUpModal.jsx'
import SettingsSheet from './components/SettingsSheet.jsx'
import InstallBanner from './components/InstallBanner.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import CategoriesScreen from './screens/CategoriesScreen.jsx'
import CharacterScreen from './screens/CharacterScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'

const screenVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

export default function App() {
  const { user, signOut, loading: authLoading } = useAuth()
  const [tab, setTab] = useState('home')
  const [showSettings, setShowSettings] = useState(false)

  const {
    quests,
    categories,
    history,
    streak,
    completeQuest,
    addQuest,
    updateQuest,
    deleteQuest,
    addCategory,
    deleteCategory,
    resetAllData,
  } = useQuests(user)

  const {
    character,
    level,
    xpInfo,
    earnedBadgeIds,
    levelUpInfo,
    completeQuestEffect,
    checkBadges,
    dismissLevelUp,
    updateName,
    resetCharacter,
  } = useCharacter(user)

  // 뱃지 체크 — streak 포함
  useEffect(() => {
    checkBadges(character, level, streak)
  }, [character, level, streak, checkBadges])

  const handleComplete = useCallback((id) => {
    const quest = completeQuest(id)
    if (quest) {
      completeQuestEffect(quest.difficulty)
    }
  }, [completeQuest, completeQuestEffect])

  const handleReset = useCallback(() => {
    resetAllData()
    resetCharacter()
  }, [resetAllData, resetCharacter])

  // 인증 로딩 중 — 스플래시
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: '#1e1a2e',
      }}>
        <div style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '12px',
          color: '#7fdbca',
          animation: 'pulse 1.2s ease-in-out infinite',
        }}>
          LOADING...
        </div>
      </div>
    )
  }

  // 미로그인 — 로그인 화면
  if (!user) {
    return <LoginScreen />
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        maxWidth: '390px',
        margin: '0 auto',
        background: '#1e1a2e',
        position: 'relative',
      }}
    >
      {/* 메인 컨텐츠 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div key="home" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }} {...screenVariants}>
              <HomeScreen
                quests={quests}
                categories={categories}
                level={level}
                xpInfo={xpInfo}
                streak={streak}
                onComplete={handleComplete}
                onAdd={addQuest}
                onUpdate={updateQuest}
                onDelete={deleteQuest}
                onSettings={() => setShowSettings(true)}
              />
            </motion.div>
          )}
          {tab === 'categories' && (
            <motion.div key="categories" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }} {...screenVariants}>
              <CategoriesScreen
                categories={categories}
                quests={quests}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
              />
            </motion.div>
          )}
          {tab === 'character' && (
            <motion.div key="character" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }} {...screenVariants}>
              <CharacterScreen
                character={character}
                level={level}
                xpInfo={xpInfo}
                streak={streak}
                earnedBadgeIds={earnedBadgeIds}
                quests={quests}
                history={history}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 탭바 */}
      <TabBar current={tab} onChange={setTab} />

      {/* PWA 홈화면 추가 배너 */}
      <InstallBanner />

      {/* 레벨업 모달 */}
      <AnimatePresence>
        {levelUpInfo && (
          <LevelUpModal
            key="levelup"
            newLevel={levelUpInfo.newLevel}
            onDismiss={dismissLevelUp}
          />
        )}
      </AnimatePresence>

      {/* 설정 시트 */}
      <AnimatePresence>
        {showSettings && (
          <SettingsSheet
            key="settings"
            character={character}
            user={user}
            onClose={() => setShowSettings(false)}
            onNameChange={updateName}
            onReset={handleReset}
            onSignOut={signOut}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
