import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db';
import { getComprehensionByLevel } from '@/lib/comprehensionData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const level = searchParams.get('level');
    const type = searchParams.get('type') || searchParams.get('question_type');
    const quizType = searchParams.get('quizType') || searchParams.get('quiz_type');
    const search = searchParams.get('search')?.toLowerCase();

    let questions = await dbRepository.find('questions');

    if (quizType === 'trueAndFalse' || quizType === 'trueFalse') {
      questions = questions.filter((q: any) => q.question_type === '2' || q.category === 'trueFalse');
    } else if (quizType === 'audioQuestions' || quizType === 'audio') {
      questions = questions.filter((q: any) => Boolean(q.audio) || q.category === '9' || q.category === 'audioQuestions' || q.category === 'audio');
    } else if (quizType === 'guessTheWord' || quizType === 'guess' || quizType === 'guessWord') {
      questions = questions.filter((q: any) => q.category === '8' || q.category === 'guess' || q.category === 'guessWord');
    } else if (quizType === 'multiMatch') {
      questions = questions.filter((q: any) => q.category === '11' || q.category === 'multiMatch');
    } else if (quizType === 'mathMania') {
      questions = questions.filter((q: any) => q.category === '10' || q.category === '3' || q.category === 'mathMania' || Boolean(q.mathEquation));
    } else if (quizType === 'dailyQuiz') {
      questions = questions.filter((q: any) => q.category === 'dailyQuiz' || q.category === 'daily');
    } else if (quizType === 'funAndLearn') {
      if (level) {
        const comp = getComprehensionByLevel(level);
        questions = comp.questions.map((q) => ({
          id: q.id,
          category: '7',
          subcategory: '701',
          level: String(level),
          question: q.question,
          question_type: q.questionType,
          optiona: q.options[0]?.title || '',
          optionb: q.options[1]?.title || '',
          optionc: q.options[2]?.title || '',
          optiond: q.options[3]?.title || '',
          answer: q.correctAnswerOptionId === 'opt1' ? 'a' : q.correctAnswerOptionId === 'opt2' ? 'b' : q.correctAnswerOptionId === 'opt3' ? 'c' : 'd',
          note: q.note || '',
          passage: q.passage || '',
        }));
      } else {
        questions = questions.filter((q: any) => Boolean(q.passage) || q.category === '7' || q.category === 'funAndLearn');
      }
    } else if (quizType === 'oneVsOneBattle' || quizType === 'groupPlay') {
      questions = questions.filter(
        (q: any) => q.category === 'battle' || (q.question_type === '1' && !q.passage && !q.mathEquation && !q.audio && q.category !== '8' && q.category !== '11' && q.category !== 'mathMania' && q.category !== '3')
      );
    } else {
      if (category) {
        const catStr = String(category);
        if (catStr === '3') {
          questions = questions.filter(
            (q: any) => String(q.category) === '3' || q.category === 'mathMania' || Boolean(q.mathEquation)
          );
        } else if (catStr === '7' || catStr === 'funAndLearn') {
          questions = questions.filter((q: any) => String(q.category) === '7' || q.category === 'funAndLearn' || Boolean(q.passage));
        } else if (catStr === '8' || catStr === 'guess') {
          questions = questions.filter((q: any) => String(q.category) === '8' || q.category === 'guess' || q.category === 'guessWord');
        } else if (catStr === '9' || catStr === 'audio') {
          questions = questions.filter((q: any) => String(q.category) === '9' || q.category === 'audio' || q.category === 'audioQuestions' || Boolean(q.audio));
        } else if (catStr === '10' || catStr === 'mathMania') {
          questions = questions.filter((q: any) => String(q.category) === '10' || String(q.category) === '3' || q.category === 'mathMania' || Boolean(q.mathEquation));
        } else if (catStr === '11' || catStr === 'multiMatch') {
          questions = questions.filter((q: any) => String(q.category) === '11' || q.category === 'multiMatch');
        } else {
          questions = questions.filter((q: any) => String(q.category) === catStr);
        }
      }

      if (subcategory) {
        questions = questions.filter((q: any) => String(q.subcategory) === String(subcategory));
      }
    }

    if (level && quizType !== 'funAndLearn') {
      const lvlFiltered = questions.filter((q: any) => String(q.level) === String(level));
      if (lvlFiltered.length > 0) {
        questions = lvlFiltered;
      }
    }

    if (type) {
      questions = questions.filter((q: any) => String(q.question_type) === String(type));
    }

    if (search) {
      questions = questions.filter(
        (q: any) =>
          q.question?.toLowerCase().includes(search) ||
          q.optiona?.toLowerCase().includes(search) ||
          q.optionb?.toLowerCase().includes(search) ||
          q.optionc?.toLowerCase().includes(search) ||
          q.optiond?.toLowerCase().includes(search) ||
          q.note?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, count: questions.length, data: questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      category = '1',
      subcategory = '101',
      level = '1',
      question,
      question_type = '1', // 1: 4 options, 2: true/false
      optiona = '',
      optionb = '',
      optionc = '',
      optiond = '',
      answer = 'a',
      note = '',
      image = '',
      passage = '',
      mathEquation = '',
      audio = '',
    } = body;

    if (!question) {
      return NextResponse.json({ success: false, message: 'Question text is required' }, { status: 400 });
    }

    const newQuestion = {
      id: String(Date.now()),
      category: String(category),
      subcategory: String(subcategory),
      level: String(level),
      question,
      question_type: String(question_type),
      optiona: question_type === '2' ? 'True' : optiona,
      optionb: question_type === '2' ? 'False' : optionb,
      optionc: question_type === '2' ? '' : optionc,
      optiond: question_type === '2' ? '' : optiond,
      answer: answer.toLowerCase(),
      note,
      image,
      passage,
      mathEquation,
      audio,
    };

    const result = await dbRepository.insertOne('questions', newQuestion);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Question ID is required' }, { status: 400 });
    }

    const updated = await dbRepository.updateOne('questions', { id: String(id) }, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Question ID is required' }, { status: 400 });
    }

    await dbRepository.deleteOne('questions', { id: String(id) });
    return NextResponse.json({ success: true, message: 'Question deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
