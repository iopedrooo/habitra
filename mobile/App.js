import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const usedUsernames = new Set(['ana', 'joao', 'maria']);

const t = {
  'pt-BR': {
    title: 'HabitRa',
    pickLanguage: 'Escolha seu idioma',
    continue: 'Continuar',
    authTitle: 'Entrar ou criar conta',
    login: 'Entrar',
    register: 'Criar conta',
    email: 'E-mail',
    password: 'Senha',
    username: 'Nome de usuário',
    sendCode: 'Enviar código',
    verify: 'Verificar',
    codeLabel: 'Código de verificação',
    dashboard: 'Painel',
    addFriend: 'Adicionar amigo',
    groupHabit: 'Hábito em grupo',
    privateHabit: 'Meta privada',
    calendar: 'Calendário',
  },
  en: {
    title: 'HabitRa',
    pickLanguage: 'Choose your language',
    continue: 'Continue',
    authTitle: 'Login or create account',
    login: 'Login',
    register: 'Create account',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    sendCode: 'Send code',
    verify: 'Verify',
    codeLabel: 'Verification code',
    dashboard: 'Dashboard',
    addFriend: 'Add friend',
    groupHabit: 'Group habit',
    privateHabit: 'Private goal',
    calendar: 'Calendar',
  },
};

export default function App() {
  const [step, setStep] = useState('language');
  const [language, setLanguage] = useState('pt-BR');
  const [mode, setMode] = useState('register');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [verificationCode, setVerificationCode] = useState('');
  const [typedCode, setTypedCode] = useState('');

  const [friends, setFriends] = useState(['amg_estudos']);
  const [newFriend, setNewFriend] = useState('');

  const [habits] = useState([
    { id: 1, name: 'Estudar', visibility: 'group', members: ['eu', 'amg_estudos'], doneBy: ['eu', 'amg_estudos'] },
    { id: 2, name: 'Leitura', visibility: 'private', members: ['eu'], doneBy: ['eu'] },
  ]);

  const copy = t[language];
  const normalizedUsername = username.trim().toLowerCase();
  const usernameAvailable = normalizedUsername && !usedUsernames.has(normalizedUsername);

  const calendarDays = useMemo(
    () => [
      { day: 'Seg', me: true, friend: true, privateGoal: false },
      { day: 'Ter', me: true, friend: false, privateGoal: true },
      { day: 'Qua', me: false, friend: true, privateGoal: false },
      { day: 'Qui', me: true, friend: true, privateGoal: false },
      { day: 'Sex', me: true, friend: false, privateGoal: true },
    ],
    []
  );

  const handleSendCode = () => {
    if (!email || !password || (mode === 'register' && !usernameAvailable)) return;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setVerificationCode(code);
    setStep('verify');
  };

  const handleVerify = () => {
    if (typedCode === verificationCode) {
      if (mode === 'register') usedUsernames.add(normalizedUsername);
      setStep('dashboard');
    }
  };

  const handleAddFriend = () => {
    const value = newFriend.trim().toLowerCase();
    if (!value || friends.includes(value)) return;
    setFriends((old) => [...old, value]);
    setNewFriend('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{copy.title}</Text>

        {step === 'language' && (
          <Card>
            <Text style={styles.sectionTitle}>{copy.pickLanguage}</Text>
            <View style={styles.row}>
              <Chip label="Português" active={language === 'pt-BR'} onPress={() => setLanguage('pt-BR')} />
              <Chip label="English" active={language === 'en'} onPress={() => setLanguage('en')} />
            </View>
            <PrimaryButton label={copy.continue} onPress={() => setStep('auth')} />
          </Card>
        )}

        {step === 'auth' && (
          <Card>
            <Text style={styles.sectionTitle}>{copy.authTitle}</Text>
            <View style={styles.row}>
              <Chip label={copy.login} active={mode === 'login'} onPress={() => setMode('login')} />
              <Chip label={copy.register} active={mode === 'register'} onPress={() => setMode('register')} />
            </View>
            <Input label={copy.email} value={email} onChangeText={setEmail} />
            <Input label={copy.password} value={password} onChangeText={setPassword} secureTextEntry />
            {mode === 'register' && (
              <>
                <Input label={copy.username} value={username} onChangeText={setUsername} />
                {!!normalizedUsername && (
                  <Text style={[styles.helper, { color: usernameAvailable ? '#22c55e' : '#ef4444' }]}>
                    {usernameAvailable ? `@${normalizedUsername} disponível` : `@${normalizedUsername} já existe`}
                  </Text>
                )}
              </>
            )}
            <PrimaryButton label={copy.sendCode} onPress={handleSendCode} />
          </Card>
        )}

        {step === 'verify' && (
          <Card>
            <Text style={styles.sectionTitle}>{copy.codeLabel}</Text>
            <Text style={styles.helper}>Código enviado para: {email}</Text>
            <Text style={styles.helper}>Demo: {verificationCode}</Text>
            <Input value={typedCode} onChangeText={setTypedCode} placeholder="000000" />
            <PrimaryButton label={copy.verify} onPress={handleVerify} />
          </Card>
        )}

        {step === 'dashboard' && (
          <>
            <Card>
              <Text style={styles.sectionTitle}>{copy.dashboard}</Text>
              <Text style={styles.helper}>Usuário: @{normalizedUsername || 'eu'}</Text>
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>{copy.addFriend}</Text>
              <Input value={newFriend} onChangeText={setNewFriend} placeholder="username" />
              <PrimaryButton label={copy.addFriend} onPress={handleAddFriend} />
              <View style={[styles.row, { marginTop: 8 }]}>
                {friends.map((f) => (
                  <Badge key={f} text={`@${f}`} />
                ))}
              </View>
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>Hábitos</Text>
              {habits.map((h) => (
                <View key={h.id} style={styles.habitItem}>
                  <Text style={styles.habitName}>{h.name}</Text>
                  <Text style={styles.helper}>
                    {h.visibility === 'group' ? copy.groupHabit : copy.privateHabit}
                  </Text>
                  <Text style={styles.helper}>Concluído por: {h.doneBy.join(', ')}</Text>
                </View>
              ))}
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>{copy.calendar}</Text>
              {calendarDays.map((d) => (
                <View key={d.day} style={styles.calendarRow}>
                  <Text style={styles.day}>{d.day}</Text>
                  <Text style={styles.dot}>{d.me ? '🟢' : '⚪️'} eu</Text>
                  <Text style={styles.dot}>{d.friend ? '🔵' : '⚪️'} amiga</Text>
                  <Text style={styles.dot}>{d.privateGoal ? '🟠' : '⚪️'} privado</Text>
                </View>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

function Input({ label, ...props }) {
  return (
    <View style={{ marginBottom: 10 }}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput style={styles.input} placeholderTextColor="#64748b" {...props} />
    </View>
  );
}

function PrimaryButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Badge({ text }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#020617' },
  container: { padding: 16, paddingBottom: 32 },
  title: { color: '#f8fafc', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  card: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipActive: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  chipText: { color: '#cbd5e1', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  inputLabel: { color: '#cbd5e1', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#f8fafc',
    backgroundColor: '#0b1220',
  },
  button: {
    marginTop: 6,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#052e16', fontWeight: '800' },
  helper: { color: '#94a3b8', marginBottom: 8 },
  badge: {
    borderWidth: 1,
    borderColor: '#1e40af',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: { color: '#93c5fd' },
  habitItem: {
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: 10,
    marginTop: 8,
  },
  habitName: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingVertical: 8,
  },
  day: { color: '#f8fafc', width: 36, fontWeight: '700' },
  dot: { color: '#cbd5e1', width: 92 },
});
