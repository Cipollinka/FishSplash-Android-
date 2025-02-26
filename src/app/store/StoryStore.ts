import {types} from 'mobx-state-tree';
import {storage} from './RootStore';

export const Prize = types.model('Prize', {
  coins: types.optional(types.number, 0),
  attempts: types.optional(types.number, 0),
});

export const Reward = types.model('Reward', {
  text: types.optional(types.string, ''),
  image: types.optional(types.string, ''),
});

export const StoryScene = types.model('StoryScene', {
  id: types.identifier,
  title: types.optional(types.string, ''),
  personName: types.optional(types.string, ''),
  text: types.string,
  backgroundImage: types.string,
  choices: types.optional(
    types.array(
      types.model({
        text: types.string,
        nextSceneId: types.string,
      }),
    ),
    [],
  ),
  prize: types.maybe(Prize),
  nextSceneId: types.maybe(types.string),
});

export const StoryStore = types
  .model('StoryStore', {
    currentSceneId: types.string,
    hasSeenIntro: types.optional(types.boolean, false),
    lastPlayedGame: types.optional(types.string, ''),
    isStoryFinished: types.optional(types.boolean, false),
  })
  .views(self => ({
    get currentScene() {
      return storyScenes.find(scene => scene.id === self.currentSceneId);
    },
  }))
  .actions(self => ({
    goToScene(sceneId: string) {
      console.log(`Navigating to scene: ${sceneId}`);
      if (sceneId.includes('evil_joe_1') || sceneId.includes('researcher_1')) {
        self.lastPlayedGame = sceneId;
      }
      console.log('self', self);

      self.currentSceneId = sceneId;
    },
    setHasSeenIntro() {
      console.log('Intro has been seen');
      self.hasSeenIntro = true;
    },
    getLastPlayedGame() {
      return self.lastPlayedGame;
    },
    setStoryFinished() {
      self.isStoryFinished = true;
    },
  }));

const storyScenes = [
  {
    id: 'intro',
    text: "You have moved to a small fishing town, full of hopes and ambitions. Your goal is to find the rare fish 'Golden Carp', of which legends abound.",
    backgroundImage: require('../../assets/images/story/story1.png'),
    title: 'Small town',
    nextSceneId: 'old_fisherman_1',
  },
  {
    id: 'old_fisherman_1',
    text: 'An old fisherman, who knows everything about the local waters, approaches you.',
    backgroundImage: require('../../assets/images/story/story2.png'),
    nextSceneId: 'old_fisherman_2',
  },
  {
    id: 'old_fisherman_2',
    personName: 'The old fisherman',
    text: "Hello, young man. Are you searching for the 'Golden Carp'? It's not an easy task. I can help you, but first, you need to learn how to catch regular fish.",
    backgroundImage: require('../../assets/images/story/story2.png'),
    nextSceneId: 'old_fisherman_3',
  },
  {
    id: 'old_fisherman_3',
    personName: 'The old fisherman',
    text: "Hello, young man. Are you searching for the 'Golden Carp'? It's not an easy task. I can help you, but first, you need to learn how to catch regular fish.",
    backgroundImage: require('../../assets/images/story/story2.png'),
    choices: [
      {
        text: 'Learning the basics is the key to success.',
        nextSceneId: 'start_1',
      },
      {
        text: 'Even the best fishermen were once beginners.',
        nextSceneId: 'start_1',
      },
    ],
  },
  {
    id: 'start_1',
    title: 'Get ready!',
    text: 'Cast your hook into specific places that you will see by pressing on the fishing rod',
    backgroundImage: require('../../assets/images/story/start_bg_1.png'),
    prize: {
      coins: 800,
      attempts: 10,
    },
  },
  {
    id: 'old_fisherman_4',
    personName: 'The old fisherman',
    text: 'Well done, lad! You’ve proven that you can achieve your goal and catch the Golden Carp!',
    backgroundImage: require('../../assets/images/story/story2.png'),
    nextSceneId: 'old_fisherman_5',
  },
  {
    id: 'old_fisherman_5',
    personName: 'The old fisherman',
    text: "Here’s a gift for you, it will come in handy! I want to help you and give you some advice: head to Captain Perico's Island and beat Evil Joe in the obstacle boat race, that way you can earn better gear and learn important information!",
    backgroundImage: require('../../assets/images/story/story_bg_1.png'),
    reward: {
      text: 'Congratulations, you have received the golden hook!',
      image: require('../../assets/images/rewards/golden_hook.png'),
    },
    nextSceneId: 'evil_joe_1',
  },
  {
    id: 'evil_joe_1',
    title: "Captain Perico's Island",
    text: "You encounter your rival, who is also eager to catch the 'Golden Carp.' He is a young man with tanned skin and short blonde hair. He wears bright fishing clothes and always carries the latest gear.",
    backgroundImage: require('../../assets/images/story/story_bg_2.png'),
    nextSceneId: 'evil_joe_2',
  },
  {
    id: 'evil_joe_2',
    personName: 'Evil Joe',
    text: 'Ho-ho! Hello there, rookie! Have you come to take part in our obstacle race and compete for the whole pot?',
    backgroundImage: require('../../assets/images/story/story3.png'),
    choices: [
      {
        text: "Let's start without empty words",
        nextSceneId: 'evil_joe_3',
      },
      {
        text: 'This challenge is mine to conquer',
        nextSceneId: 'evil_joe_3',
      },
    ],
  },
  {
    id: 'evil_joe_3',
    personName: 'Evil Joe',
    text: 'Let’s see what you’re made of! Don’t think you can outpace me! I know all the secrets of this place. I’ll wager my professional gear; if you beat me, you can take it!',
    backgroundImage: require('../../assets/images/story/story3.png'),
    nextSceneId: 'start_2',
  },
  {
    id: 'start_2',
    title: 'Get ready!',
    text: 'You need to sail through stones and seastones to get prize!',
    backgroundImage: require('../../assets/images/story/start_bg_2.png'),
    prize: {
      coins: 1000,
      items: [
        require('../../assets/images/rewards/stones.png'),
        require('../../assets/images/rewards/corals.png'),
      ],
    },
  },
  {
    id: 'evil_joe_4',
    personName: 'Evil Joe',
    text: "WHAT? How did you do that? No one has ever overtaken me on Cayo Perico, I'm amazed!Here, as a sign of great respect, take my professional gear that will help you catch the Golden Carp.",
    backgroundImage: require('../../assets/images/story/story3.png'),
    reward: {
      text: 'Congratulations, you have received the professional gear!',
      image: require('../../assets/images/rewards/professional_gear.png'),
    },
    nextSceneId: 'evil_joe_5',
  },
  {
    id: 'evil_joe_5',
    personName: 'Evil Joe',
    text: 'I want to advise you to head to Bilgams Town and find the mysterious underwater researcher. She will be able to help you achieve your goal of catching the Golden Carp! Good luck! I hope to accomplish this in the future!',
    backgroundImage: require('../../assets/images/story/story3.png'),
    choices: [
      {
        text: 'Move to Bilgams Town',
        nextSceneId: 'researcher_1',
      },
    ],
  },
  {
    id: 'researcher_1',
    title: 'Bilgams Town',
    text: 'After moving to the town, you wander around for a while trying to find the mysterious researcher. \n\n Suddenly, you notice a small shop with wall, medium, and small paper maps. \n\n Upon entering, you see her and immediately realize that she is the mysterious researcher!',
    backgroundImage: require('../../assets/images/story/story_bg_3.png'),
    nextSceneId: 'researcher_2',
  },
  {
    id: 'researcher_2',
    personName: 'Researcher',
    text: 'Hello! What is your question? How can I help?',
    backgroundImage: require('../../assets/images/story/story4.png'),
    choices: [
      {
        text: 'I want to have all infotmation, that you might know about Golden Carp',
        nextSceneId: 'researcher_3',
      },
    ],
  },
  {
    id: 'researcher_3',
    personName: 'Researcher',
    text: 'Oh, of course I can tell you about it, this magical creature, capturing which, a fisherman gains eternal happiness and prosperity.',
    backgroundImage: require('../../assets/images/story/story4.png'),
    nextSceneId: 'researcher_4',
  },
  {
    id: 'researcher_4',
    personName: 'Researcher',
    text: 'If you are looking for it, you can play my game and obtain the strongest tackle with which you will be able to catch the Golden Carp.',
    backgroundImage: require('../../assets/images/story/story4.png'),
    choices: [
      {
        text: 'I would like to find him',
        nextSceneId: 'start_3',
      },
    ],
  },
  {
    id: 'start_3',
    title: 'Get ready!',
    text: 'You need to arrange the correct sequence',
    backgroundImage: require('../../assets/images/story/start_bg_3.png'),
    prize: {
      coins: 1000,
      items: [require('../../assets/images/rewards/fish.png')],
    },
  },
  {
    id: 'researcher_5',
    personName: 'Researcher',
    text: 'Congratulations! You have successfully completed my game, and I can confidently give you my magical fishing gear! Here you go!',
    backgroundImage: require('../../assets/images/story/story4.png'),
    reward: {
      text: 'Congratulations, you have received the magical fishing gear!',
      image: require('../../assets/images/rewards/fish.png'),
    },
    nextSceneId: 'researcher_6',
  },
  {
    id: 'researcher_6',
    personName: 'Researcher',
    text: 'Now I will mark on the map where you need to go to find the Golden Carp',
    backgroundImage: require('../../assets/images/story/story4.png'),
    nextSceneId: 'researcher_7',
  },
  {
    id: 'researcher_7',
    text: 'This is the Bay of the Golden Eye, where the Golden Carp resides, good luck with your search!',
    backgroundImage: require('../../assets/images/story/story5.png'),
    choices: [
      {
        text: 'Set off to the Golden Eye',
        nextSceneId: 'researcher_8',
      },
    ],
  },
  {
    id: 'researcher_8',
    title: 'Bay of the Golden Eye',
    text: 'Upon arriving here, you felt the clouds gathering and everything turning grey. After a while, you gather all your collected trophies and set off in search of...',
    backgroundImage: require('../../assets/images/story/story6.png'),
    nextSceneId: 'researcher_9',
  },
  {
    id: 'researcher_9',
    text: 'After spending several hours fishing, you almost lost faith that it was possible, but... Casting your line once again with the magical gear and bait, you felt something very heavy and glowing with a yellow sheen bite, and you reacted instantly...',
    backgroundImage: require('../../assets/images/story/story6.png'),
    nextSceneId: 'finish',
  },
  {
    id: 'finish',
    text: 'And thanks to your strong hands, you managed it! You pulled out the long-awaited Golden Carp, which was beautiful and shone very brightly, a true miracle!',
    backgroundImage: require('../../assets/images/story/story6.png'),
  },
];
