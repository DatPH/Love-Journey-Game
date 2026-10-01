import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Shuffle, 
  Lock, 
  Unlock, 
  Timer, 
  Award, 
  Heart, 
  Flame, 
  Smartphone,
  ChevronRight,
  ArrowRightLeft,
  Check
} from 'lucide-react';
import { CoupleProfile } from '../../types';
import { soundFx } from '../../utils/sound';

interface Level14Props {
  profile: CoupleProfile;
  onComplete: (earnedLp: number, notes?: string) => void;
  onBack: () => void;
  isAlreadyCompleted?: boolean;
}

// 5 Emotion Categories (Selected by the Woman)
const EMOTION_CATEGORIES = [
  {
    id: 'emo-romance',
    title: 'Lãng Mạn Ngôn Tình',
    icon: '💖',
    tag: 'Ngọt ngào sâu lắng',
    desc: 'Ánh mắt đắm đuối, cử chỉ âu yếm dịu dàng và những câu nói làm tan chảy trái tim.',
  },
  {
    id: 'emo-comedy',
    title: 'Hài Hước & Lầy Lội',
    icon: '🤪',
    tag: 'Tiếng cười rộn ràng',
    desc: 'Biểu cảm tấu hài, trêu ghẹo đáng yêu, không được để đối phương nhịn được cười.',
  },
  {
    id: 'emo-cute',
    title: 'Nũng Nịu & Dỗ Dành',
    icon: '🥺',
    tag: 'Cưng chiều hết nấc',
    desc: 'Làm nũng xin xỏ hoặc giận hờn đáng yêu, đối phương phải dỗ dành và cưng nựng.',
  },
  {
    id: 'emo-flirty',
    title: 'Quyến Rũ & Hút Hồn',
    icon: '🔥',
    tag: 'Sức hút khó cưỡng',
    desc: 'Ánh nhìn thiêu đốt, lời khen táo bạo chạm vào tim khiến đối phương đỏ mặt bối rối.',
  },
  {
    id: 'emo-grateful',
    title: 'Biết Ơn & Chân Thành',
    icon: '✨',
    tag: 'Chạm tới đáy lòng',
    desc: 'Bộc bạch điều người ấy từng làm khiến bạn cảm thấy may mắn và hạnh phúc nhất.',
  },
];

// 5 Restriction Categories (Selected by the Man)
const RESTRICTION_CATEGORIES = [
  {
    id: 'res-silent',
    title: 'Không Dùng Lời Nói (Kịch Câm 100%)',
    icon: '🤐',
    tag: 'Giao tiếp hình thể',
    desc: 'Tuyệt đối không được phát ra tiếng nói, chỉ dùng ánh mắt, cử chỉ tay và biểu cảm.',
  },
  {
    id: 'res-prop',
    title: 'Sử Dụng 1 Đạo Cụ Bất Kỳ',
    icon: '🧸',
    tag: 'Tận dụng đồ vật',
    desc: 'Phải lấy một món đồ ngẫu nhiên gần đó (chiếc gối, cốc nước, áo khoác, thỏi son...).',
  },
  {
    id: 'res-speed',
    title: 'Chạy Đua 90 Giây Chớp Nhoáng',
    icon: '⏱️',
    tag: 'Tốc độ dồn dập',
    desc: 'Phải bắt đầu và hoàn thành trọn vẹn màn hẹn hò trước khi đồng hồ 90s đếm về 0.',
  },
  {
    id: 'res-distance',
    title: 'Giữ Khoảng Cách 1.5 Mét (Không Chạm)',
    icon: '↔️',
    tag: 'Khoảng cách xa xăm',
    desc: 'Đứng cách xa nhau 1.5m, truyền tải năng lượng và cảm xúc mà không được chạm cơ thể.',
  },
  {
    id: 'res-care',
    title: 'Kèm Theo Hành Động Chăm Sóc',
    icon: '💆',
    tag: 'Chăm sóc thực tế',
    desc: 'Phải vừa thực hiện vừa đút đồ ăn/nước uống, massage vai hoặc âu yếm vuốt tóc đối phương.',
  },
];

// Function to generate the synthesized Dating Challenge
function generateDatingChallenge(
  emo: typeof EMOTION_CATEGORIES[0], 
  res: typeof RESTRICTION_CATEGORIES[0],
  femaleName: string,
  maleName: string
) {
  const map: Record<string, Record<string, { title: string; mission: string; steps: string[]; proTip: string }>> = {
    'emo-romance': {
      'res-silent': {
        title: 'Màn Tỏ Tình Bằng Ánh Mắt Không Lời',
        mission: `${femaleName} và ${maleName} hãy trao cho nhau một khoảnh khắc lãng mạn ngôn tình sâu lắng mà tuyệt đối không được nói bất kỳ từ nào.`,
        steps: [
          `Bước 1: ${maleName} nắm nhẹ hai bàn tay của ${femaleName}, nhìn thẳng vào mắt nhau.`,
          `Bước 2: ${femaleName} dùng biểu cảm gương mặt và cử chỉ tay để diễn tả "Em yêu anh rất nhiều".`,
          `Bước 3: Cả hai trao nhau một cái ôm siết chặt trong im lặng ấm áp.`,
        ],
        proTip: 'Đừng cười phá lên quá sớm, hãy để cảm xúc tự nhiên dẫn lối trong 30 giây đầu!',
      },
      'res-prop': {
        title: 'Trao Kỷ Vật Hẹn Hò & Lời Hứa Lãng Mạn',
        mission: `${maleName} tìm 1 món đồ vật trong phòng để ${femaleName} biến nó thành "tín vật đính ước" lãng mạn giữa hai bạn.`,
        steps: [
          `Bước 1: ${maleName} lấy một món đồ ngẫu nhiên gần đó (chiếc gối, cốc nước, vòng tay...).`,
          `Bước 2: ${femaleName} cầm món đồ và nói một câu tỏ tình ngọt ngào gắn liền với món đồ đó.`,
          `Bước 3: Cả hai cùng chạm tay vào món đồ và trao nhau một nụ hôn nhẹ lên má.`,
        ],
        proTip: 'Dù là món đồ ngớ ngẩn nhất cũng hãy nói bằng tông giọng sến sẩm như phim Hàn!',
      },
      'res-speed': {
        title: '90 Giây Chìm Đắm Trong Mật Ngọt',
        mission: `Trong đúng 90 giây đếm ngược, cả hai phải tạo nên một khoảnh khắc lãng mạn cao trào nhất từ trước đến nay.`,
        steps: [
          `Bước 1: Bật một đoạn nhạc du dương ngẫu nhiên hoặc ngân nga một giai điệu tình ca.`,
          `Bước 2: ${maleName} ôm eo ${femaleName} khiêu vũ nhẹ nhàng 3 vòng quanh phòng.`,
          `Bước 3: ${femaleName} tựa đầu vào vai ${maleName} và nói 3 lời ngọt ngào trước khi hết giờ.`,
        ],
        proTip: 'Hãy đếm nhịp thở của nhau để hòa cùng một nhịp đập!',
      },
      'res-distance': {
        title: 'Thần Giao Cách Cảm Qua Khoảng Cách 1.5 Mét',
        mission: `Đứng cách nhau 1.5 mét, hai bạn phải truyền tải sự lãng mạn cháy bỏng mà không được bước lại gần chạm nhau.`,
        steps: [
          `Bước 1: Cả hai đứng ở hai vị trí cách nhau 1.5 mét, nhìn chăm chú vào đối phương.`,
          `Bước 2: ${femaleName} bắn tim và nói lời yêu thương say đắm qua khoảng không gian.`,
          `Bước 3: ${maleName} đưa tay ra đón lấy và ôm ngực thể hiện tim đang tan chảy vì nàng.`,
        ],
        proTip: 'Khoảng cách vật lý càng xa thì cảm xúc kết nối càng mãnh liệt!',
      },
      'res-care': {
        title: 'Giai Thoại Chăm Sóc Tình Củm Ngọt Lịm',
        mission: `Vừa bộc lộ tình cảm lãng mạn nồng nàn vừa thực hiện một hành động chăm sóc dịu dàng cho người ấy.`,
        steps: [
          `Bước 1: ${maleName} nhẹ nhàng massage vai hoặc chải nhẹ mái tóc của ${femaleName}.`,
          `Bước 2: ${femaleName} đút cho ${maleName} một ngụm nước hoặc một miếng đồ ăn vặt.`,
          `Bước 3: Cả hai nhìn nhau và nói: "Cảm ơn vì đã luôn chăm sóc em/anh".`,
        ],
        proTip: 'Sự chăm sóc ân cần chính là ngôn ngữ tình yêu chân thật nhất.',
      },
    },
    'emo-comedy': {
      'res-silent': {
        title: 'Kịch Câm Tấu Hài: Ai Cười Trước Là Thua',
        mission: `Cả hai phải làm mặt xấu hoặc diễn trò lầy lội không lời thoại, ai bật cười thành tiếng trước sẽ bị phạt!`,
        steps: [
          `Bước 1: Cả hai đối mặt nhau, tuyệt đối giữ im lặng không nói một lời.`,
          `Bước 2: ${femaleName} bắt đầu biến hóa biểu cảm mặt lầy lội nhất có thể để chọc cười ${maleName}.`,
          `Bước 3: ${maleName} đáp trả bằng các cử chỉ hình thể tếu táo cho đến khi cả hai cười nghiêng ngả.`,
        ],
        proTip: 'Nhịn cười trong 10 giây đầu là một cực hình siêu vui đấy!',
      },
      'res-prop': {
        title: 'Biểu Diễn Xiếc Đạo Cụ Siêu Lầy',
        mission: `Sử dụng 1 đồ vật bất kỳ làm đạo cụ để tạo nên tiểu phẩm hài hước ngắn phục vụ đối phương.`,
        steps: [
          `Bước 1: ${maleName} chọn 1 món đồ (cái chổi, cái thìa, cái gối, cái chăn...).`,
          `Bước 2: ${femaleName} hóa thân thành MC truyền hình hài hước giới thiệu công năng kỳ lạ của món đồ.`,
          `Bước 3: Cả hai cùng tương tác tấu hài với món đồ đó và kết thúc bằng một tràng cười thả ga.`,
        ],
        proTip: 'Đừng ngại làm lố, càng lố thì kỷ niệm càng đáng nhớ!',
      },
      'res-speed': {
        title: 'Thử Thách Chọc Cười 90 Giây Thần Tốc',
        mission: `Trong 90 giây, ${femaleName} có nhiệm vụ chọc cho ${maleName} phải cười phá lên bằng mọi chiêu trò hài hước.`,
        steps: [
          `Bước 1: ${maleName} cố gắng giữ bộ mặt "lạnh lùng băng giá" không cảm xúc.`,
          `Bước 2: ${femaleName} tung các câu đùa lầy lội, cù lét hoặc làm điệu bộ kỳ cục nhất.`,
          `Bước 3: Ngay khi ${maleName} bật cười, cả hai đập tay ăn mừng chiến thắng!`,
        ],
        proTip: 'Điểm yếu dễ cười nhất của người ấy là gì? Khai thác ngay!',
      },
      'res-distance': {
        title: 'Đấu Trường Khiêu Vũ Lầy Lội Cách Nhau 1.5 Mét',
        mission: `Đứng cách nhau 1.5m và thi thố những điệu nhảy bựa nhất mà hai bạn từng thấy.`,
        steps: [
          `Bước 1: Giữ khoảng cách 1.5 mét giữa hai người.`,
          `Bước 2: ${femaleName} thực hiện 1 điệu nhảy con vịt hoặc robot kỳ dị.`,
          `Bước 3: ${maleName} bắt chước và biến tấu thêm phần lầy lội để đáp lễ.`,
        ],
        proTip: 'Bật một bài nhạc sôi động làm nền để tăng thêm độ hài hước!',
      },
      'res-care': {
        title: 'Chăm Sóc Kiểu "Bá Đạo" Có 1-0-2',
        mission: `Thực hiện một hành động chăm sóc cho nhau nhưng với phong cách lầy lội và biểu cảm hài hước.`,
        steps: [
          `Bước 1: ${maleName} vừa đấm bóp vai cho ${femaleName} vừa làm động tác "võ sư kungfu".`,
          `Bước 2: ${femaleName} đút nước cho ${maleName} như đút cho em bé quý tộc.`,
          `Bước 3: Cả hai cúi chào nhau như hai diễn viên hài kịch vừa diễn xong xuất sắc.`,
        ],
        proTip: 'Tiếng cười chính là liều thuốc gắn kết mạnh mẽ nhất.',
      },
    },
    'emo-cute': {
      'res-silent': {
        title: 'Mèo Con Làm Nũng Không Lời',
        mission: `${femaleName} hóa thân thành bé mèo nũng nịu không lời thoại, đòi ${maleName} phải dỗ dành và xoa đầu.`,
        steps: [
          `Bước 1: ${femaleName} phụng phịu má, giơ hai tay làm móng mèo nũng nịu.`,
          `Bước 2: ${maleName} phải hiểu ý, lập tức ôm chặt và xoa đầu vuốt ve.`,
          `Bước 3: Cả hai trao nhau nụ cười cưng chiều ngọt ngào.`,
        ],
        proTip: 'Ánh mắt long lanh chớp chớp là vũ khí tối thượng của phái đẹp!',
      },
      'res-prop': {
        title: 'Làm Nũng Bằng Thú Bông / Chiếc Gối Ôm',
        mission: `${femaleName} mượn một chiếc gối hoặc thú bông để giấu mặt làm nũng đòi ${maleName} chiều chuộng.`,
        steps: [
          `Bước 1: ${femaleName} ôm chiếc gối che nửa mặt, giọng nũng nịu nói 1 điều ước muốn ${maleName} làm cho.`,
          `Bước 2: ${maleName} ôm cả chiếc gối lẫn người yêu vào lòng và dõng dạc hứa thực hiện.`,
          `Bước 3: Cả hai cụng trán vào nhau để chốt kèo điều ước.`,
        ],
        proTip: 'Hãy đòi một điều ước thực tế như bao ăn hoặc đấm lưng nhé!',
      },
      'res-speed': {
        title: 'Cơn Mưa Dỗ Dành Trong 90 Giây',
        mission: `${femaleName} giả vờ dỗi hờn, ${maleName} có đúng 90 giây để dùng 5 câu nịnh ngọt ngào nhất dỗ nàng tươi cười trở lại.`,
        steps: [
          `Bước 1: ${femaleName} khoanh tay quay mặt đi làm bộ dỗi hờn.`,
          `Bước 2: ${maleName} áp sát, liên tục nói những câu khen ngợi có cánh và xin lỗi ngọt lịm.`,
          `Bước 3: Trước khi hết 90s, ${femaleName} nở nụ cười tha thứ và thưởng cho chàng một cái ôm.`,
        ],
        proTip: 'Đừng ngần ngại nói những lời khen sến sẩm nhất mà bình thường ít nói!',
      },
      'res-distance': {
        title: 'Màn Gửi Tín Hiệu Nũng Nịu Tầm Xa 1.5 Mét',
        mission: `Đứng cách xa nhau 1.5m, ${femaleName} làm các động tác nhõng nhẽo đòi được ôm, khiến ${maleName} phát cuồng vì độ đáng yêu.`,
        steps: [
          `Bước 1: Đứng cách nhau 1.5 mét.`,
          `Bước 2: ${femaleName} chìa hai tay về phía trước, dậm chân nũng nịu đòi được ôm.`,
          `Bước 3: ${maleName} làm động tác ôm không khí từ xa và khen: "Sao mà đáng yêu thế này!"`,
        ],
        proTip: 'Sự kiềm chế không được lao vào ôm sẽ làm khoảnh khắc bùng nổ hơn!',
      },
      'res-care': {
        title: 'Được Cưng Chiều Như Công Chúa',
        mission: `${femaleName} tận hưởng sự chiều chuộng tuyệt đối khi ${maleName} ân cần phục vụ và dỗ dành từng cử chỉ.`,
        steps: [
          `Bước 1: ${maleName} đấm lưng, bóp vai và hỏi han ân cần: "Hôm nay em có mệt không?"`,
          `Bước 2: ${femaleName} nũng nịu tựa vào người chàng tận hưởng.`,
          `Bước 3: ${maleName} hôn lên trán ${femaleName} và thì thầm lời yêu thương.`,
        ],
        proTip: 'Phái đẹp luôn xứng đáng được cưng chiều như một nàng công chúa.',
      },
    },
    'emo-flirty': {
      'res-silent': {
        title: 'Điệu Bộ Quyến Rũ Khiến Tim Đập Loạn Nhịp',
        mission: `${femaleName} dùng ánh mắt thiêu đốt và cử chỉ cuốn hút không lời khiến ${maleName} phải bối rối đỏ mặt.`,
        steps: [
          `Bước 1: Cả hai đứng sát nhau trong im lặng.`,
          `Bước 2: ${femaleName} vuốt nhẹ lọn tóc, nhìn thẳng vào mắt ${maleName} với ánh nhìn say đắm quyến rũ.`,
          `Bước 3: ${maleName} đặt tay lên ngực mình cảm nhận nhịp tim đang tăng vọt.`,
        ],
        proTip: 'Sức hút từ ánh mắt có sức mạnh hơn ngàn lời nói!',
      },
      'res-prop': {
        title: 'Vũ Khí Quyến Rũ Cùng Chiếc Áo Khoác / Khăn Choàng',
        mission: `Sử dụng chiếc áo khoác hoặc một món đồ để tạo nên khoảnh khắc thả thính quyến rũ bất ngờ.`,
        steps: [
          `Bước 1: ${femaleName} khoác nhẹ chiếc áo hoặc dùng một đạo cụ tạo dáng cuốn hút.`,
          `Bước 2: Tiến lại gần ${maleName} và thì thầm một lời khen táo bạo vào tai chàng.`,
          `Bước 3: ${maleName} giữ chặt eo ${femaleName} đáp lại bằng một cái nhìn đầy si mê.`,
        ],
        proTip: 'Thì thầm sát tai luôn tạo ra luồng điện cảm xúc cực mạnh!',
      },
      'res-speed': {
        title: '90 Giây Thả Thính Táo Bạo Nhất',
        mission: `Trong 90 giây, ${femaleName} tung liên tiếp những câu thả thính nảy lửa khiến ${maleName} gục ngã hoàn toàn.`,
        steps: [
          `Bước 1: Đồng hồ 90 giây bắt đầu đếm ngược.`,
          `Bước 2: ${femaleName} nhìn sâu vào mắt ${maleName} và nói 2 câu tỏ tình táo bạo nhất.`,
          `Bước 3: ${maleName} ôm siết lấy nàng trước khi đồng hồ điểm giây cuối cùng.`,
        ],
        proTip: 'Hãy nói những điều bạn thường nghĩ trong đầu nhưng ngại nói ra!',
      },
      'res-distance': {
        title: 'Sức Hút Ma Lực Xuyên Khoảng Cách 1.5 Mét',
        mission: `Đứng cách nhau 1.5m, hai bạn trao nhau ánh nhìn nồng nàn thiêu đốt không gian giữa hai người.`,
        steps: [
          `Bước 1: Giữ khoảng cách 1.5 mét.`,
          `Bước 2: ${femaleName} cắn nhẹ môi, gửi một nụ hôn gió quyến rũ về phía chàng.`,
          `Bước 3: ${maleName} vờ bị nụ hôn gió "đánh trúng tim" và tiến lại gần chạm nhẹ bàn tay nàng.`,
        ],
        proTip: 'Sự căng thẳng tích cực khi không được chạm nhau sẽ làm tăng nhịp tim!',
      },
      'res-care': {
        title: 'Chạm Nhẹ Đầy Mê Hoặc',
        mission: `Kết hợp cử chỉ chăm sóc với thần thái quyến rũ khiến khoảnh khắc hẹn hò nóng bừng cảm xúc.`,
        steps: [
          `Bước 1: ${femaleName} nhẹ nhàng chỉnh lại cổ áo hoặc vuốt nhẹ bờ vai ${maleName}.`,
          `Bước 2: Nhìn thẳng vào môi đối phương với vẻ say đắm.`,
          `Bước 3: Cả hai chạm trán vào nhau và chia sẻ một hơi thở ấm áp.`,
        ],
        proTip: 'Sự tinh tế trong từng cái chạm nhẹ sẽ để lại dư vị khó quên.',
      },
    },
    'emo-grateful': {
      'res-silent': {
        title: 'Bức Tâm Thư Không Lời: Sự Biết Ơn Sâu Sắc',
        mission: `Không dùng lời nói, hai bạn thể hiện sự biết ơn và trân trọng sâu sắc đối phương qua cử chỉ ấm áp nhất.`,
        steps: [
          `Bước 1: Cả hai ngồi đối diện nhau, đặt tay lên ngực của đối phương cảm nhận nhịp tim.`,
          `Bước 2: Gật đầu và trao nhau nụ cười ấm áp ngập tràn lòng biết ơn.`,
          `Bước 3: Trao nhau một cái ôm thật chặt và lâu trong 30 giây im lặng thiêng liêng.`,
        ],
        proTip: 'Khi không có ngôn từ, trái tim sẽ lắng nghe rõ nhất.',
      },
      'res-prop': {
        title: 'Trao Cốc Nước Ấm & Lời Cảm Ơn Từ Trái Tim',
        mission: `Dùng một cốc nước ấm hoặc món đồ ăn nhỏ để trao nhau lời cảm ơn chân thành nhất về một việc người ấy đã làm.`,
        steps: [
          `Bước 1: ${femaleName} trao cho ${maleName} một cốc nước hoặc một món đồ ý nghĩa.`,
          `Bước 2: Nói ra 1 điều cụ thể mà ${maleName} từng làm khiến bạn cảm thấy vô cùng biết ơn.`,
          `Bước 3: ${maleName} đón nhận và nói lời cảm ơn vì đã luôn ở bên cạnh chàng.`,
        ],
        proTip: 'Nói ra sự biết ơn là chìa khóa để tình yêu bền chặt trọn đời.',
      },
      'res-speed': {
        title: '90 Giây Thổ Lộ Điều Biết Ơn Nhất',
        mission: `Trong 90 giây đếm ngược, cả hai lần lượt nói ra điều mình trân quý nhất ở bạn đời.`,
        steps: [
          `Bước 1: ${femaleName} có 45 giây nói ra điều mình biết ơn nhất ở ${maleName}.`,
          `Bước 2: ${maleName} có 45 giây đáp lại điều mình trân trọng nhất ở ${femaleName}.`,
          `Bước 3: Kết thúc bằng một cái nắm tay đan chặt ngón vào nhau.`,
        ],
        proTip: 'Càng chi tiết và chân thành, khoảnh khắc càng xúc động!',
      },
      'res-distance': {
        title: 'Gửi Lời Tri Ân Xuyên Không Gian 1.5 Mét',
        mission: `Đứng cách nhau 1.5m, hai bạn trịnh trọng cúi đầu cảm ơn và bộc bạch tình cảm chân thành cho nhau.`,
        steps: [
          `Bước 1: Đứng cách nhau 1.5 mét trong tư thế trang trọng.`,
          `Bước 2: ${femaleName} chia sẻ lời cảm ơn từ tận đáy lòng đến ${maleName}.`,
          `Bước 3: Cả hai cùng bước lại gần nhau, xóa bỏ khoảng cách bằng một cái ôm nồng thắm.`,
        ],
        proTip: 'Khoảnh khắc bước lại gần nhau sẽ cực kỳ xúc động và ý nghĩa!',
      },
      'res-care': {
        title: 'Liệu Trình Chăm Sóc Đầy Lòng Biết Ơn',
        mission: `Vừa chăm sóc đôi bàn tay cho nhau vừa ôn lại những kỷ niệm ngọt ngào hai đứa cùng vượt qua.`,
        steps: [
          `Bước 1: ${femaleName} cầm lấy bàn tay của ${maleName}, nhẹ nhàng xoa bóp từng ngón tay.`,
          `Bước 2: Nói: "Cảm ơn bàn tay này đã luôn che chở và làm việc vì hai đứa mình".`,
          `Bước 3: ${maleName} nâng bàn tay nàng lên và đặt lên đó một nụ hôn trân trọng.`,
        ],
        proTip: 'Đôi bàn tay đã cùng nhau nắm chặt qua bao thăng trầm, hãy trân quý nó!',
      },
    },
  };

  const defaultChallenge = {
    title: `Thử Thách Hẹn Hò: ${emo.title} & ${res.title}`,
    mission: `Hãy cùng nhau trải nghiệm một buổi hẹn hò ngập tràn phong cách "${emo.title}" kết hợp cùng điều kiện "${res.title}".`,
    steps: [
      `Bước 1: ${maleName} chuẩn bị tâm thế và thiết lập điều kiện "${res.title}".`,
      `Bước 2: ${femaleName} dẫn dắt cảm xúc theo phong cách "${emo.title}".`,
      `Bước 3: Cả hai phối hợp ăn ý để hoàn thành trọn vẹn thử thách trong sự gắn kết sâu sắc.`,
    ],
    proTip: 'Thả lỏng cơ thể và tận hưởng từng khoảnh khắc bên nhau!',
  };

  return map[emo.id]?.[res.id] || defaultChallenge;
}

export const Level14BipolarFusion: React.FC<Level14Props> = ({
  profile,
  onComplete,
  onBack,
  isAlreadyCompleted = false,
}) => {
  // Allow couple to assign who is Woman (Emotion picker) and who is Man (Restriction picker)
  // By default: profile.name2 is Woman, profile.name1 is Man (or toggleable)
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const femaleName = isSwapped ? profile.name1 : profile.name2;
  const maleName = isSwapped ? profile.name2 : profile.name1;

  // Flow: 'female_pick' -> 'hand_off' -> 'male_pick' -> 'fusion_reveal' -> 'executing' -> 'finished'
  const [step, setStep] = useState<'female_pick' | 'hand_off' | 'male_pick' | 'fusion_reveal' | 'executing' | 'finished'>('female_pick');

  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [selectedRestriction, setSelectedRestriction] = useState<number | null>(null);

  // 90s execution timer
  const [timerLeft, setTimerLeft] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const handleSelectEmotion = (idx: number) => {
    soundFx.playPop();
    setSelectedEmotion(idx);
  };

  const handleConfirmEmotion = () => {
    if (selectedEmotion === null) return;
    soundFx.playPop();
    setStep('hand_off');
  };

  const handleUnlockRestriction = () => {
    soundFx.playPop();
    setStep('male_pick');
  };

  const handleSelectRestriction = (idx: number) => {
    soundFx.playPop();
    setSelectedRestriction(idx);
  };

  const handleFuseCards = () => {
    if (selectedRestriction === null) return;
    soundFx.playSuccess();
    setStep('fusion_reveal');
  };

  const handleStartExecution = () => {
    soundFx.playBell();
    setTimerLeft(90);
    setIsTimerRunning(true);
    setStep('executing');
  };

  // Execution Countdown
  useEffect(() => {
    let interval: number;
    if (isTimerRunning && step === 'executing') {
      interval = window.setInterval(() => {
        setTimerLeft((t) => {
          if (t <= 1) {
            soundFx.playBell();
            setIsTimerRunning(false);
            return 0;
          }
          if (t <= 5) soundFx.playTap();
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, step]);

  const handleFinishedChallenge = () => {
    soundFx.playSuccess();
    setIsTimerRunning(false);
    setStep('finished');
  };

  const handleRestart = () => {
    soundFx.playPop();
    setStep('female_pick');
    setSelectedEmotion(null);
    setSelectedRestriction(null);
    setTimerLeft(90);
    setIsTimerRunning(false);
  };

  const handleToggleRoles = () => {
    soundFx.playPop();
    setIsSwapped((s) => !s);
  };

  const currentEmo = selectedEmotion !== null ? EMOTION_CATEGORIES[selectedEmotion] : null;
  const currentRes = selectedRestriction !== null ? RESTRICTION_CATEGORIES[selectedRestriction] : null;

  const challengeData = (currentEmo && currentRes)
    ? generateDatingChallenge(currentEmo, currentRes, femaleName, maleName)
    : null;

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-2 select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-violet-100 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ</span>
        </button>
        <span className="text-[11px] font-extrabold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
          Màn 14 · Hợp Nhất Đa Cực
        </span>
        <button
          onClick={handleRestart}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Role Assignment Card */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-purple-200/80 mb-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-slate-800 leading-tight">
              👩 <span className="text-rose-600">{femaleName}</span> (Cảm xúc) ✦ 👨 <span className="text-indigo-600">{maleName}</span> (Giới hạn)
            </p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Kết hợp 2 điều kiện tạo thử thách hẹn hò thực tế
            </p>
          </div>
        </div>

        {step === 'female_pick' && (
          <button
            onClick={handleToggleRoles}
            className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-white px-2 py-1 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors flex-shrink-0"
            title="Đổi vai trò giữa hai bạn"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Đổi Vai</span>
          </button>
        )}
      </div>

      {/* STEP 1: WOMAN PICKS EMOTION */}
      {step === 'female_pick' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 shadow-sm text-center space-y-1">
            <span className="text-[10px] text-rose-600 uppercase font-black tracking-widest block">
              BẠN NỮ: {femaleName} CHỌN THẺ CẢM XÚC (EMOTION)
            </span>
            <h3 className="text-base font-black text-slate-900">
              {femaleName} muốn thử thách hẹn hò hôm nay mang cảm xúc gì?
            </h3>
            <p className="text-xs text-slate-500">
              (Bí mật chọn điều bạn muốn và không để {maleName} nhìn thấy nhé!)
            </p>
          </div>

          <div className="space-y-2">
            {EMOTION_CATEGORIES.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleSelectEmotion(idx)}
                className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                  selectedEmotion === idx
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md ring-2 ring-rose-200'
                    : 'bg-white text-slate-700 border-stone-200 hover:border-rose-300 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{card.icon}</span>
                    <span className="font-extrabold text-xs">{card.title}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    selectedEmotion === idx ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {card.tag}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${
                  selectedEmotion === idx ? 'text-rose-100' : 'text-slate-500'
                }`}>
                  {card.desc}
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirmEmotion}
            disabled={selectedEmotion === null}
            className={`w-full py-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all ${
              selectedEmotion !== null
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/25 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Khóa Thẻ Cảm Xúc & Chuyền Cho {maleName}</span>
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: HAND OFF GATING */}
      {step === 'hand_off' && (
        <div className="py-8 px-4 text-center space-y-6 bg-slate-950 text-white rounded-3xl shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-violet-400 uppercase tracking-widest font-black">
              ĐÃ KHÓA THẺ CẢM XÚC 🔒
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Chuyền điện thoại cho {maleName}!
            </h2>
            <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
              {femaleName} đã chọn xong cảm xúc chủ đạo. Bây giờ tới lượt {maleName} chọn một Thẻ Giới Hạn bí mật để kết hợp thành thử thách hẹn hò.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleUnlockRestriction}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Unlock className="w-4 h-4" />
              <span>Tôi Là {maleName} - Chọn Thẻ Giới Hạn</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MAN PICKS RESTRICTION */}
      {step === 'male_pick' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 shadow-sm text-center space-y-1">
            <span className="text-[10px] text-indigo-600 uppercase font-black tracking-widest block">
              BẠN NAM: {maleName} CHỌN THẺ GIỚI HẠN (RESTRICTION)
            </span>
            <h3 className="text-base font-black text-slate-900">
              {maleName} muốn đặt điều kiện giới hạn nào cho buổi hẹn?
            </h3>
            <p className="text-xs text-slate-500">
              (Thẻ này sẽ kết hợp với Thẻ Cảm Xúc của {femaleName} để tạo nên thử thách!)
            </p>
          </div>

          <div className="space-y-2">
            {RESTRICTION_CATEGORIES.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleSelectRestriction(idx)}
                className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                  selectedRestriction === idx
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white text-slate-700 border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{card.icon}</span>
                    <span className="font-extrabold text-xs">{card.title}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    selectedRestriction === idx ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {card.tag}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${
                  selectedRestriction === idx ? 'text-indigo-100' : 'text-slate-500'
                }`}>
                  {card.desc}
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={handleFuseCards}
            disabled={selectedRestriction === null}
            className={`w-full py-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all ${
              selectedRestriction !== null
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-indigo-500/25 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>KẾT HỢP & MỞ THỬ THÁCH HẸN HÒ! ⚡</span>
          </button>
        </div>
      )}

      {/* STEP 4: FUSION REVEAL & DATING CHALLENGE MISSION */}
      {step === 'fusion_reveal' && currentEmo && currentRes && challengeData && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#25152A] via-[#1B1020] to-[#120A15] text-white shadow-xl space-y-4 border border-violet-900 text-left">
            <div className="text-center space-y-1">
              <span className="text-[10px] text-fuchsia-400 uppercase tracking-widest font-black block animate-pulse">
                ✨ THỬ THÁCH HẸN HÒ ĐÃ HỢP NHẤT ✨
              </span>
              <h2 className="text-lg font-black text-amber-300">
                "{challengeData.title}"
              </h2>
            </div>

            {/* 2 Criteria Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200">
                <span className="text-[9px] block text-rose-400 font-bold uppercase">{femaleName} (Cảm xúc):</span>
                <p className="font-extrabold text-xs mt-0.5">{currentEmo.icon} {currentEmo.title}</p>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-200">
                <span className="text-[9px] block text-indigo-400 font-bold uppercase">{maleName} (Giới hạn):</span>
                <p className="font-extrabold text-xs mt-0.5">{currentRes.icon} {currentRes.title}</p>
              </div>
            </div>

            {/* Core Mission */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block mb-1">
                  Mục Tiêu Thử Thách Hẹn Hò:
                </span>
                <p className="text-xs font-semibold text-white leading-relaxed">
                  {challengeData.mission}
                </p>
              </div>

              {/* 3 Steps */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                <span className="text-[10px] font-bold text-stone-300 uppercase block">
                  3 Bước Phối Hợp Thực Hiện:
                </span>
                {challengeData.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-stone-200">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>

              {/* Pro Tip */}
              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-200 italic">
                💡 {challengeData.proTip}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartExecution}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Timer className="w-4 h-4" />
            <span>Bắt Đầu Thực Hiện Thử Thách (Đếm Ngược 90s)</span>
          </button>
        </div>
      )}

      {/* STEP 5: EXECUTING LIVE CHALLENGE */}
      {step === 'executing' && currentEmo && currentRes && challengeData && (
        <div className="space-y-4 animate-in fade-in duration-150 text-center">
          <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl space-y-4 border border-violet-900">
            <div className="flex items-center justify-between text-xs font-bold px-2">
              <span className="text-stone-400">THỜI GIAN HẸN HÒ:</span>
              <span className={`font-mono text-2xl font-black px-4 py-1 rounded-full ${
                timerLeft <= 15 ? 'bg-rose-500/30 text-rose-400 animate-ping' : 'bg-white/10 text-amber-300'
              }`}>
                {timerLeft}s
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/15 text-xs text-left space-y-1.5">
              <h4 className="text-amber-300 font-extrabold text-sm">{challengeData.title}</h4>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {challengeData.mission}
              </p>
              <div className="pt-2 text-[10px] text-stone-400 border-t border-white/10 space-y-0.5">
                <p>✦ {femaleName} (Cảm xúc): <strong className="text-rose-300">{currentEmo.title}</strong></p>
                <p>✦ {maleName} (Giới hạn): <strong className="text-indigo-300">{currentRes.title}</strong></p>
              </div>
            </div>

            <p className="text-xs text-stone-300 italic">
              Hai bạn đang cùng nhau hòa mình vào thử thách hẹn hò... Tận hưởng từng giây nhé!
            </p>
          </div>

          <button
            onClick={handleFinishedChallenge}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã Cùng Nhau Hoàn Thành Xuất Sắc!</span>
          </button>
        </div>
      )}

      {/* STEP 6: FINISHED SUMMARY */}
      {step === 'finished' && currentEmo && currentRes && challengeData && (
        <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-violet-50 to-pink-50 border border-violet-200 shadow-sm space-y-3 text-left">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-white text-violet-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-7 h-7 text-violet-600" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-lg font-black text-slate-900">
                HỢP NHẤT HẸN HÒ THÀNH CÔNG! 🎉
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                Chúc mừng <strong className="text-rose-600">{femaleName}</strong> và <strong className="text-indigo-600">{maleName}</strong> đã vượt qua thử thách:
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs space-y-1 text-center">
              <p className="font-extrabold text-purple-900 text-sm">
                "{challengeData.title}"
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Pha trộn giữa <strong>{currentEmo.title}</strong> & <strong>{currentRes.title}</strong>
              </p>
            </div>

            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-violet-700 shadow-2xs">
                <Award className="w-4 h-4 text-amber-500" />
                <span>+450 Love Power Sáng Tạo</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onComplete(450, `Hẹn hò hợp nhất: "${challengeData.title}" (${currentEmo.title} + ${currentRes.title})`)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-violet-500/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn Thành Màn 14 & Nhận 450 LP</span>
          </button>
        </div>
      )}
    </div>
  );
};
