# 🎙️ SoundWave — Player e Streaming de Podcasts Acadêmicos

<p align="center">
  <img src="assets/icon.png" alt="Logo SoundWave" width="120" />
</p>

Aplicativo mobile nativo Android desenvolvido para a disciplina **PPDM2 — Programação para Dispositivos Móveis II (Aula 16: Personalização Nativa - Ícones e Splash Screens)**, ministrada pelo Prof. Adriano Rosa Mazetto.

O **SoundWave** é uma plataforma focada em streaming, descoberta e curadoria de podcasts científicos, seminários e conteúdos acadêmicos, contando com identidade visual nativa completa e build automatizado na nuvem via GitHub Actions.

---

## 📱 Capturas de Tela (Screenshots)

| Ícone na Tela Inicial | Splash Screen Nativa | Interface Principal & Player |
| :---: | :---: | :---: |
| <img src="screenshots/Design sem nome.png" alt="Tela Principal SoundWave" width="240" /> |

---

## 🎨 Identidade Visual e Branding (Aluno #11)

- **Nome do Aplicativo:** SoundWave
- **Proposta:** Player e Streaming de Podcasts Acadêmicos
- **Paleta de Cores:**
  - Roxo Vibrante (`#9333EA`) — Cor primária e identidade de marca
  - Roxo Profundo (`#7E22CE`) — Fundo da Splash Screen nativa
  - Grafite Escuro (`#09090B`) — Interface *Dark Mode*
  - Branco Puro (`#FFFFFF`) — Logotipo e tipografia principal
- **Assets Nativos (`@capacitor/assets`):**
  - `assets/icon.png` (`1024x1024px`) — Ícone adaptativo com fundo opaco e margem de segurança (*Safe Zone*).
  - `assets/splash.png` (`2732x2732px`) — Tela de abertura com logotipo centralizado na área segura.
  - Geração automática para todas as densidades Android (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`).

---

## ✨ Funcionalidades do Aplicativo

- **Catálogo Acadêmico & Busca:** Pesquisa instantânea por docentes, instituições ou temas e filtros por áreas do conhecimento (*Computação*, *IA & Dados*, *Pesquisa*, *Física*).
- **Player Completo & Mini-Player Flutuante:** Barra de progresso interativa, controle de velocidade de reprodução (`1x`, `1.25x`, `1.5x`, `2x`) e reprodução de áudio.
- **Modal Expandido com Abstract:** Visualização do resumo científico completo do episódio em execução.
- **Biblioteca Pessoal:** Sistema para favoritar e salvar episódios para acesso rápido.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, TypeScript, Vite, CSS3, Lucide React
- **Empacotamento Nativo:** Capacitor 6 (`@capacitor/android`, `@capacitor/splash-screen`, `@capacitor/status-bar`)
- **Automação de Recursos:** `@capacitor/assets`
- **CI/CD (Build na Nuvem):** GitHub Actions (`.github/workflows/android-build.yml`) gerando o artefato `meu-aplicativo-apk`

---

## 🚀 Como Executar o Projeto Localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Gerar o build da aplicação web
npm run build

# 3. Gerar os ícones e splash screens nativos do Android
npx capacitor-assets generate --android

# 4. Sincronizar com o projeto Android
npx cap sync android