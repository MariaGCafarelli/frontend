import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'foroFilter'
})
export class ForoFilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultForum=[];
    for(const forum of value){
       if(forum.title.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultForum.push(forum);
       }

    }
    return resultForum;

  }

}
