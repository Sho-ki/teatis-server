import { ActionStep, MicroGoal } from '@prisma/client';
import { MicroGoalSubCategoryTypes } from '../src/shared/constants/microGoalCategories';

interface ActionStepType extends Pick<ActionStep, 'mainText' | 'subText' | 'reason' | 'order' | 'id' > {
    imageUrl?: string;
}

interface MicroGoalType extends Pick<MicroGoal, 'label' | 'id'> {
    subCategory: { name: MicroGoalSubCategoryTypes };
    actionSteps: ActionStepType[];
}

const stressMicroGoals: MicroGoalType[] = [
  {
    id: 1,
    label: 'Practice stress-reducing techniques for improved diabetes management.',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsStress },
    actionSteps: [
      {
        id: 1,
        order: 1,
        mainText: 'Take five deep breaths during stressful situations.',
        subText: undefined,
        reason: 'Deep breathing can promote relaxation and stress reduction.',
      },
      {
        id: 2,
        order: 2,
        mainText: 'Try progressive muscle relaxation to release tension in the body.',
        subText: undefined,
        reason: 'Progressive muscle relaxation helps to relieve tension and promote relaxation.',
      },
      {
        id: 3,
        order: 3,
        mainText: 'Try visualization techniques, such as imagining a peaceful scene or place.',
        subText: undefined,
        reason: 'Visualization can help to calm the mind and reduce stress.',
      },
    ],
  },

  {
    id: 2,
    label: 'Try mindfulness every day for improved diabetes management.',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsStress },
    actionSteps: [
      {
        id: 4,
        order: 1,
        mainText: 'Take 5 minutes each day to focus on breathing and being present in the moment.',
        subText: undefined,
        reason: 'Mindfulness can help to reduce stress and improve mental well-being.',
      },
      {
        id: 5,
        order: 2,
        mainText: 'Set a timer for 5 minutes and sit in a comfortable position with your back straight. Close your eyes and concentrate on your breath breathing slowly in and out.',
        subText: undefined,
        reason: 'Regular mindfulness practice can enhance focus and self-awareness.',
      },
      {
        id: 6,
        order: 3,
        mainText: 'Practice mindfulness meditation for 10-15 minutes per day.',
        subText: undefined,
        reason: 'Daily meditation can improve mental clarity and emotional well-being.',
      },
      {
        id: 7,
        order: 4,
        mainText: 'Integrate mindfulness into daily routine, such as taking a few deep breaths before meals.',
        subText: undefined,
        reason: 'Incorporating mindfulness into daily activities can promote overall well-being.',
      },
      {
        id: 8,
        order: 5,
        mainText: 'Try various mindfulness practices, like mindful walking or body scan meditation. For example, set aside 10-15 minutes each day to take a walk in nature or in a quiet area or find a comfortable and quiet place to lie down or sit.',
        subText: undefined,
        reason: 'Exploring different mindfulness practices can help you find the most effective techniques for you.',
      },
      {
        id: 9,
        order: 6,
        mainText: 'Identify triggers of mindless eating and use mindfulness strategies as prevention.',
        subText: undefined,
        reason: 'Being mindful of eating habits can help prevent overeating and promote healthier food choices.',
      },
    ],
  },
  {
    id: 3,
    label: 'Manage stress levels for improved diabetes management.',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsStress },
    actionSteps: [
      {
        id: 10,
        order: 1,
        mainText: 'Take deep breaths for 1-2 minutes when feeling stressed.',
        subText: undefined,
        reason: 'Deep breathing can help to reduce stress and promote relaxation.',
      },
      {
        id: 11,
        order: 2,
        mainText: 'Try stress-reducing activities into daily routine, such as yoga or meditation.',
        subText: undefined,
        reason: 'Incorporating stress-reducing activities into your daily life can improve overall well-being.',
      },
      {
        id: 12,
        order: 3,
        mainText: 'Try different stress-reducing activities, such as guided imagery or progressive muscle relaxation.',
        subText: undefined,
        reason: 'Exploring a variety of stress-reducing activities can help you find the most effective methods for managing stress.',
      },
      {
        id: 13,
        order: 4,
        mainText: 'Identify triggers of stress and develop strategies to manage them.',
        subText: undefined,
        reason: 'Understanding stress triggers can enable you to better manage and reduce stress in your life.',
      },
    ],
  },
  {
    id: 4,
    label: 'Practice positive self-talk for improved diabetes management',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsStress },
    actionSteps: [
      {
        id: 14,
        order: 1,
        mainText: 'Identify negative self-talk patterns and replace them with positive affirmations.',
        subText: undefined,
        reason: 'Positive self-talk can improve self-esteem and overall well-being.',
      },
      {
        id: 15,
        order: 2,
        mainText: 'Try positive self-talk into daily routine, such as repeating affirmations while brushing teeth or driving.',
        subText: undefined,
        reason: 'Incorporating positive self-talk into daily activities can reinforce positive thinking.',
      },
    ],
  },
  {
    id: 5,
    label: 'Try aromatherapy for improved diabetes management',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsStress },
    actionSteps: [
      {
        id: 16,
        order: 1,
        mainText: 'Choose a calming essential oil, such as lavender or chamomile.',
        subText: undefined,
        reason: 'Aromatherapy can promote relaxation and reduce stress.',
      },
      {
        id: 17,
        order: 2,
        mainText: 'Try aromatherapy into daily routine, such as diffusing essential oils at home or work.',
        subText: undefined,
        reason: 'Incorporating aromatherapy into daily life can create a more relaxing environment.',
      },
      {
        id: 18,
        order: 3,
        mainText: 'Try different essential oils for different purposes, such as peppermint for energy or eucalyptus for respiratory support.',
        subText: undefined,
        reason: 'Experimenting with various essential oils can help you find the best options for your needs.',
      },
    ],
  },

];

const hydrationMicroGoals: MicroGoalType[] = [
  {
    id: 6,
    label: 'Try to drink at least 8 cups (64 ounces) of water every day. Replace sugar free drinks to water.',
    subCategory: { name: MicroGoalSubCategoryTypes.Water },
    actionSteps: [
      {
        id: 19,
        order: 1,
        mainText: 'When you wake up, drink 1 cup (8 ounces) of water.',
        subText: 'Pack sugar-free drinks in the truck for on-the-go hydration.',
        reason: 'Drinking water first thing in the morning can help you meet your daily hydration goals.',
      },
      {
        id: 20,
        order: 2,
        mainText: 'Have a 1 cup of water (8 ounces) with every meal, for another 24 ounces.',
        subText: 'Choose sugar-free options when ordering/buying drinks.',
        reason: 'Drinking water/ choosing sugar-free options with meals can help you meet your daily hydration goals.',
      },
      {
        id: 21,
        order: 3,
        mainText: 'Monitor urine color. If you\'re well hydrated, urine is a pale yellow color.',
        subText: undefined,
        reason: 'Urine color can be an indicator of your hydration status.',
      },
      {
        id: 22,
        order: 4,
        mainText: 'During the day, drink another 4 cups (32 ounces) of water. Fill a water bottle and finish it during the day.',
        subText: 'Try different sugar-free drink options, such as sparkling water, herbal tea, or coconut water.',
        reason: 'Drinking water throughout the day can help maintain consistent hydration levels.',
      },
      {
        id: 23,
        order: 5,
        mainText: 'Develop a hydration plan for days when driving long distances, such as stopping at specific intervals to drink water or setting a reminder to drink water every hour.',
        subText: undefined,
        reason: 'A hydration plan can help you stay on track with your fluid intake during long drives.',
      },
      {
        id: 24,
        order: 6,
        mainText: 'Track your daily fluid intake and aim to consume at least 8-10 cups (64-80 ounces) of water or other fluids.',
        subText: undefined,
        reason: 'Tracking fluid intake can help ensure you stay adequately hydrated.',
      },
      {
        id: 25,
        order: 7,
        mainText: 'Drink at least 8 cups (64 ounces) of water every day.',
        subText: undefined,
        reason: 'Meeting daily water intake goals can help maintain proper hydration and overall health.',
      },
    ],
  },
];

const exerciseMicroGoals: MicroGoalType[] = [
  {
    id: 7,
    label: 'Manage neck and arm pain for improved quality of life.',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsExercise },
    actionSteps: [
      {
        id: 26,
        order: 1,
        mainText: 'Try to sit with good posture while driving.',
        subText: 'Sit with good posture throughout the day, especially when sitting for more than 30 minutes at a time.',
        reason: 'Good posture can help prevent and manage neck and arm pain.',
      },
      {
        id: 27,
        order: 2,
        mainText: 'Try stretching and range-of-motion exercises into daily routine, aiming for at least 10 minutes per day.',
        subText: undefined,
        reason: 'Stretching and exercises can help alleviate pain and promote mobility.',
      },
      {
        id: 28,
        order: 3,
        mainText: 'Use heat or ice therapy for pain management, depending on the type of pain. For example, use ice for sharp or severe pain, and heat for chronic pain.',
        subText: undefined,
        reason: 'Heat and ice therapy can help alleviate pain and promote relaxation.',
      },
      {
        id: 29,
        order: 4,
        mainText: 'Identify triggers of pain, such as certain activities or positions, and develop strategies to manage them. For example, if prolonged sitting causes pain, take frequent breaks to stand up and stretch.',
        subText: undefined,
        reason: 'Identifying triggers can provide valuable insight and develop strategies to prevent or manage pain.',
      },
    ],
  },
  {
    id: 8,
    label: 'Try exercising with resistance bands for strength training on the road.',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsExercise },
    actionSteps: [
      {
        id: 30,
        order: 1,
        mainText: 'Pack a resistance band in the truck for on-the-go workouts.',
        subText: undefined,
        reason: 'Resistance bands are portable and can provide a challenging workout.',
      },
      {
        id: 31,
        order: 2,
        mainText: 'Use resistance bands as part of your morning or evening routine.',
        subText: undefined,
        reason: 'Incorporating resistance band exercises into a routine can promote consistency.',
      },
      {
        id: 32,
        order: 3,
        mainText: 'Use resistance bands for a full-body workout.',
        subText: undefined,
        reason: 'Full-body workouts can contribute to overall strength and health.',
      },
      {
        id: 33,
        order: 4,
        mainText: 'Increase resistance band tension or switch to a stronger band.',
        subText: undefined,
        reason: 'Progressing to stronger bands can provide a challenging workout.',
      },
    ],
  },
  {
    id: 9,
    label: 'Try leg exercises to improve circulation during long periods of sitting.',
    subCategory: { name: MicroGoalSubCategoryTypes.Legs },
    actionSteps: [
      {
        id: 34,
        order: 1,
        mainText: 'Stretch legs for five minutes every two hours.',
        subText: undefined,
        reason: 'Incorporating leg stretches can promote circulation and prevent stiffness.',
      },
      {
        id: 35,
        order: 2,
        mainText: 'Try calf raises during rest stops.',
        subText: undefined,
        reason: 'Calf raises can promote circulation and provide a challenging workout.',
      },
      {
        id: 36,
        order: 3,
        mainText: 'Try seated leg extensions during rest stops.',
        subText: undefined,
        reason: 'Seated leg extensions can provide a challenging workout without leaving the truck.',
      },
      {
        id: 37,
        order: 4,
        mainText: 'Increase the number of sets and reps for leg exercises.',
        subText: undefined,
        reason: 'Progressing exercises can provide a challenging workout.',
      },
    ],
  },
  {
    id: 10,
    label: 'Manage arm pain',
    subCategory: { name: MicroGoalSubCategoryTypes.Arms },
    actionSteps: [
      {
        id: 38,
        order: 1,
        mainText: 'Arm Circles: This exercise can help to improve range of motion and flexibility in the arms. Stand with your feet shoulder-width apart, and hold your arms out to your sides. Make small circles with your arms, gradually increasing the size of the circles. Repeat for 10-15 repetitions, then switch directions.',
        subText: undefined,
        reason: 'Simple yet effective way to keep the shoulder joint lubricated under low amounts of load.',
      },
      {
        id: 39,
        order: 2,
        mainText: 'Chair Dips: This exercise targets the tricep muscles, which are important for pushing and pulling objects. Sit on the edge of a chair or bench, and place your hands on the edge behind you with your fingers pointing forward. Slowly lower your body down towards the ground by bending your elbows, then push back up to the starting position. Repeat for 10-15 repetitions.',
        subText: undefined,
        reason: 'This exercise is a great way to work the triceps without putting too much stress on the shoulder joint.',
      },
      {
        id: 40,
        order: 3,
        mainText: 'Wall Push-Ups: This exercise targets multiple muscle groups in the arms, chest, and shoulders. Stand facing a wall with your feet shoulder-width apart, and place your hands on the wall at shoulder-height. Slowly lower your body towards the wall by bending your elbows, then push back up to the starting position. Repeat for 10-15 repetitions.',
        subText: undefined,
        reason: 'This exercise is a great way to work the chest and shoulders without putting too much stress on the shoulder joint.',
      },
      {
        id: 41,
        order: 4,
        mainText: 'Plank Hold: This exercise targets the core, arms, and shoulders. Begin in a plank position with your hands shoulder-width apart, and hold for 30 seconds to 1 minute. For an easier modification, you can perform the plank on your knees instead of your toes.',
        subText: undefined,
        reason: 'This can help to improve core strength and stability, which is important for maintaining proper posture while sitting in a truck all day.',
      },
    ],
  },
  {
    id: 11,
    label: 'Try balance exercises for improved joint health and fall prevention.',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsExercise },
    actionSteps: [
      {
        id: 42,
        order: 1,
        mainText: 'Try standing on a firm and flat surface while having one hand on a wall. Remove your hand from the wall and try to balance for a few seconds.',
        subText: 'Try standing on a firm pillow while having one hand on a wall. Remove your hand from the wall and try to balance for a few seconds.',
        reason: 'Standing on one foot can promote balance and joint health.',
      },
      {
        id: 43,
        order: 2,
        mainText: 'Try the "seated heel-to-toe" exercise by sitting with your feet flat on the floor and slowly lifting your heel up while keeping your toes on the ground, then lowering your heel and lifting your toes.',
        subText: 'Try walking across a room using heel-to-toe steps and place one foot directly in front of the other.',
        reason: 'Heel-to-toe walking can promote balance and coordination.',
      },
      {
        id: 44,
        order: 3,
        mainText: 'Stand with feet hip width apart and lift up one heel so only the toes are touching the floor, then lift the foot off the floor try to balance for a few seconds, repeat on the other side. Hold onto the wall if needed.',
        subText: undefined,
        reason: 'Incorporating equipment can provide a challenging workout and promote balance.',
      },
      {
        id: 45,
        order: 4,
        mainText: 'Do balance exercises three days every week.',
        subText: undefined,
        reason: 'Progressing exercises can provide a challenging workout and promote balance.',
      },
    ],
  },
  {
    id: 12,
    label: 'Try neck stretches and exercises for improved mobility and pain relief.',
    subCategory: { name: MicroGoalSubCategoryTypes.Neck },
    actionSteps: [
      {
        id: 46,
        order: 1,
        mainText: 'Practice simple neck stretches, such as side-to-side head turns.',
        subText: undefined,
        reason: 'Simple stretches can provide relief and promote mobility.',
      },
      {
        id: 47,
        order: 2,
        mainText: 'Try neck stretches and exercises into morning or evening routine.',
        subText: undefined,
        reason: 'Trying stretches and exercises into a routine can promote consistency.',
      },
      {
        id: 48,
        order: 3,
        mainText: 'Try different neck stretches and exercises, such as shoulder blade squeezes or chin tucks.',
        subText: undefined,
        reason: 'Trying a variety of exercises can promote a well-rounded routine.',
      },
      {
        id: 49,
        order: 4,
        mainText: 'Do neck stretches at least 5 minutes daily.',
        subText: undefined,
        reason: 'Progressing stretches and exercises can provide a challenging workout and promote mobility.',
      },
    ],
  },
];

const bloodSugarMicroGoals: MicroGoalType[] = [
  {
    id: 13,
    label: 'Check blood sugar levels regularly for improved diabetes management.',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsA1c },
    actionSteps: [
      {
        id: 50,
        order: 1,
        mainText: 'Set a reminder to check blood sugar levels at consistent intervals, such as before meals.',
        subText: undefined,
        reason: 'Monitoring blood glucose levels regularly is important for maintaining overall health',
      },
      {
        id: 51,
        order: 2,
        mainText: 'Keep a log of blood sugar readings and note any patterns or trends.',
        subText: undefined,
        reason: 'Identifying trends in blood glucose levels can help to adjust medications or lifestyle habits to better manage diabetes.',
      },
      {
        id: 52,
        order: 3,
        mainText: 'Share blood sugar logs with coach for review and feedback.',
        subText: undefined,
        reason: 'Identifying areas of improvement in blood sugar management and adjusting treatment plans accordingly.',
      },
    ],
  },

];

const foodMicroGoals: MicroGoalType[] = [
  {
    id: 14,
    label: 'Send images of your meals to your coach for personalized feedback.',
    subCategory: { name: MicroGoalSubCategoryTypes.TipsFood },
    actionSteps: [
      {
        id: 53,
        order: 1,
        mainText: 'Take a picture of each meal you eat throughout the day, and send the pictures of your meal to your coach.',
        subText: undefined,
        reason: 'Your coach can provide valuable feedback and guidance on your food choices.',
      },
      {
        id: 54,
        order: 2,
        mainText: 'Review the feedback from your coach and apply it to your future meal choices.',
        subText: undefined,
        reason: 'Making informed adjustments to your diet can lead to better health outcomes.',
      },
    ],
  },

];

export const microGoals = [
  ...stressMicroGoals,
  ...hydrationMicroGoals,
  ...exerciseMicroGoals,
  ...bloodSugarMicroGoals,
  ...foodMicroGoals,
];
